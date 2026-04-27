#!/usr/bin/env python3
"""
Upload downloaded images to Supabase Storage (record-images bucket)
and update records.image_path with the storage path.

Storage path convention (matches existing records): records/{record_id}/original
"""
import json
import os
import urllib.request
import urllib.parse
from pathlib import Path

SCRIPT_DIR = Path(__file__).parent
IMAGES_DIR = SCRIPT_DIR / "images"

SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://xlojicyooqatkvyfwhbm.supabase.co")
SERVICE_KEY  = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")

if not SERVICE_KEY:
    raise SystemExit("Set SUPABASE_SERVICE_ROLE_KEY env var before running.")

# serial -> (old_s3_id, extension)
IMAGE_MAP = {
    "B12332807G": ("210", "JPG"),
    "B68066248C": ("207", "jpg"),
    "B68667364E": ("256", "jpg"),
    "E45266143A": ("261", "jpg"),
    "E50316831I": ("170", "jpeg"),
    "E50369214C": ("262", "jpg"),
    "F24370397S": ("269", "JPG"),
    "F55144497P": ("195", "jpg"),
    "J16341105B": ("187", "jpg"),
    "J89829060A": ("257", "JPG"),
    "K18244355E": ("171", "jpeg"),
    "K74366415C": ("278", "jpeg"),
    "L31957653L": ("255", "JPG"),
    "L65915808J": ("251", "jpg"),
}

CONTENT_TYPES = {
    "jpg": "image/jpeg", "JPG": "image/jpeg",
    "jpeg": "image/jpeg",
    "png": "image/png",
}


def supabase_req(method, path, data=None, content_type="application/json", extra_headers=None):
    url = f"{SUPABASE_URL}{path}"
    headers = {
        "apikey": SERVICE_KEY,
        "Authorization": f"Bearer {SERVICE_KEY}",
        "Content-Type": content_type,
    }
    if extra_headers:
        headers.update(extra_headers)
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as resp:
            return resp.status, json.loads(resp.read() or b"[]")
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read() or b"{}")


def get_record_id(serial):
    """Get the DB record id for the latest sighting of a serial."""
    path = f"/rest/v1/records?serial=eq.{serial}&order=created_at.desc&limit=1&select=id,created_at"
    status, data = supabase_req("GET", path)
    if status == 200 and data:
        return data[0]["id"]
    return None


def upload_image(record_id, file_path, ext):
    """Upload image to Supabase Storage at records/{record_id}/original."""
    storage_path = f"records/{record_id}/original"
    img_data = file_path.read_bytes()
    ct = CONTENT_TYPES.get(ext, "image/jpeg")

    status, resp = supabase_req(
        "POST",
        f"/storage/v1/object/record-images/{storage_path}",
        data=img_data,
        content_type=ct,
        extra_headers={"x-upsert": "true"},
    )
    return status, storage_path


def update_record_image(record_id, image_path, ext):
    """Update records.image_path and image_content_type."""
    ct = CONTENT_TYPES.get(ext, "image/jpeg")
    payload = json.dumps({"image_path": image_path, "image_content_type": ct}).encode()
    status, resp = supabase_req(
        "PATCH",
        f"/rest/v1/records?id=eq.{record_id}",
        data=payload,
        extra_headers={"Prefer": "return=minimal"},
    )
    return status


for serial, (s3_id, ext) in sorted(IMAGE_MAP.items()):
    local_file = IMAGES_DIR / f"images_{s3_id}_large.{ext}"
    if not local_file.exists():
        print(f"SKIP {serial}: file not found ({local_file.name})")
        continue

    record_id = get_record_id(serial)
    if not record_id:
        print(f"SKIP {serial}: no matching record in DB")
        continue

    print(f"{serial} (record {record_id}): uploading {local_file.name} ...")
    up_status, storage_path = upload_image(record_id, local_file, ext)
    if up_status not in (200, 201):
        print(f"  ERROR uploading: status {up_status}")
        continue

    patch_status = update_record_image(record_id, storage_path, ext)
    if patch_status in (200, 204):
        print(f"  OK -> image_path = {storage_path}")
    else:
        print(f"  ERROR updating record: status {patch_status}")

print("\nDone.")
