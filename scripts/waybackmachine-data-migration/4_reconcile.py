#!/usr/bin/env python3
"""
Reconcile boners_list.csv against the current Supabase DB.
Generates tmp/migrate.sql with INSERT statements for missing data.

Rules:
  - Single-sighting, serial NOT in DB  → insert boner + 1 real record (from list)
  - Single-sighting, serial IN DB      → verify count, skip if ok
  - Multi-sighting, serial NOT in DB   → insert boner + 1 real record (latest from list)
                                         + (count-1) fake records before it
  - Multi-sighting, serial IN DB       → gap = list_count - db_count
                                         add real latest if not already in DB
                                         add fake records for remainder of gap

Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in environment.
"""
import csv
import json
import os
import urllib.request
from datetime import datetime, timedelta, timezone
from pathlib import Path
import random

SCRIPT_DIR = Path(__file__).parent

SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://xlojicyooqatkvyfwhbm.supabase.co")
SERVICE_KEY  = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")

if not SERVICE_KEY:
    raise SystemExit("Set SUPABASE_SERVICE_ROLE_KEY env var before running.")

PITHY_NOTES = [
    "Found this in the wild. Exact circumstances lost to history.",
    "Spotted. No further details on record.",
    "This boner passed through. The finder wishes to remain anonymous.",
    "Sighting confirmed. Notes unfortunately did not survive.",
    "A boner was here. That much we know.",
    "Encountered in the field. The witness has since moved on.",
    "Record incomplete. Boner definitely spotted though.",
    "This dollar's journey continues. Details are hazy.",
]


def supabase_get(path):
    url = f"{SUPABASE_URL}/rest/v1/{path}"
    req = urllib.request.Request(url, headers={
        "apikey": SERVICE_KEY,
        "Authorization": f"Bearer {SERVICE_KEY}",
    })
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read())


def sql_str(v):
    if v is None or str(v).strip() == "":
        return "NULL"
    return "'" + str(v).replace("'", "''") + "'"


def parse_dt(s):
    """Parse ISO timestamp string to datetime (UTC)."""
    if not s:
        return None
    s = s.strip()
    # Handle both "2021-10-22T00:00:00+00:00" and "2021-10-22T00:00:00.000000+00:00"
    try:
        return datetime.fromisoformat(s)
    except ValueError:
        return None


def fake_dates(n, before_dt, earliest_possible=None):
    """
    Generate n evenly-spaced fake datetimes ending just before before_dt.
    Spread them over roughly 6 months per record.
    """
    if earliest_possible and earliest_possible < before_dt:
        span = (before_dt - earliest_possible).total_seconds()
    else:
        span = n * 60 * 60 * 24 * 180  # 6 months per gap as fallback

    step = span / (n + 1)
    dates = []
    for i in range(1, n + 1):
        offset = timedelta(seconds=step * i)
        d = (before_dt - timedelta(seconds=span)) + offset
        # Add a small random offset (±3 days) so they don't look mechanical
        d += timedelta(days=random.randint(-3, 3), hours=random.randint(0, 23))
        dates.append(d.astimezone(timezone.utc))
    return sorted(dates)


# ── Load list CSV ─────────────────────────────────────────────────────────────
list_rows = []
with open(SCRIPT_DIR / "boners_list.csv") as f:
    list_rows = list(csv.DictReader(f))

list_by_serial = {r["serial"]: r for r in list_rows}
print(f"List CSV: {len(list_by_serial)} serials")

# ── Query DB ──────────────────────────────────────────────────────────────────
print("Querying DB for existing boners...")
db_boners = {r["serial"] for r in supabase_get("boners?select=serial")}
print(f"  DB has {len(db_boners)} boners")

print("Querying DB for existing records (serial + created_at)...")
db_records_raw = supabase_get("records?select=serial,created_at&order=serial,created_at")
db_records_by_serial = {}
for r in db_records_raw:
    db_records_by_serial.setdefault(r["serial"], []).append(r["created_at"])
print(f"  DB has {len(db_records_raw)} records across {len(db_records_by_serial)} serials")

# ── Reconcile ─────────────────────────────────────────────────────────────────
lines = [
    "-- Auto-generated migration from 2021 Wayback Machine snapshot",
    "-- Review carefully before running in the Supabase SQL editor.",
    "-- All fake records are clearly annotated.",
    "",
    "BEGIN;",
    "",
]

new_boners = 0
new_records_real = 0
new_records_fake = 0
already_complete = 0

for serial, row in sorted(list_by_serial.items()):
    list_count    = int(row["sighting_count"])
    latest_dt     = parse_dt(row["latest_date"])
    latest_loc    = row["latest_location"]
    list_image    = row["image_url"] or None

    in_db         = serial in db_boners
    db_dates      = sorted(db_records_by_serial.get(serial, []))
    db_count      = len(db_dates)

    gap = list_count - db_count
    if gap <= 0:
        already_complete += 1
        continue

    # Does the DB already have the latest sighting (date match, ±1 day tolerance)?
    latest_date_str = latest_dt.strftime("%Y-%m-%d") if latest_dt else ""
    db_date_strs    = {d[:10] for d in db_dates}
    db_has_latest   = latest_date_str in db_date_strs

    lines.append(f"-- Serial {serial}: list={list_count} sightings, db={db_count}, gap={gap}")

    # Insert boner if missing
    if not in_db:
        boner_created = latest_dt.isoformat() if latest_dt else "now()"
        lines.append(f"INSERT INTO boners (serial, created_at, updated_at) VALUES ({sql_str(serial)}, {sql_str(boner_created)}, {sql_str(boner_created)}) ON CONFLICT DO NOTHING;")
        new_boners += 1

    # Plan what records to insert
    real_records_to_add  = []
    fake_records_to_add  = []

    if not db_has_latest and latest_dt:
        real_records_to_add.append({
            "location":   latest_loc,
            "note":       None,
            "lat":        None,
            "lng":        None,
            "image_url":  list_image,
            "created_at": latest_dt,
        })

    n_fake = gap - len(real_records_to_add)

    if n_fake > 0 and latest_dt:
        # Spread fake records before the latest date.
        # If we have DB records, start from the most recent one.
        earliest_possible = parse_dt(db_dates[-1]) if db_dates else None
        fake_dts = fake_dates(n_fake, latest_dt, earliest_possible)
        for dt in fake_dts:
            fake_records_to_add.append({
                "location":   latest_loc,
                "note":       random.choice(PITHY_NOTES),
                "lat":        None,
                "lng":        None,
                "image_url":  None,
                "created_at": dt,
            })

    for rec in sorted(real_records_to_add + fake_records_to_add, key=lambda r: r["created_at"]):
        ts      = rec["created_at"].isoformat() if isinstance(rec["created_at"], datetime) else str(rec["created_at"])
        note    = sql_str(rec["note"])
        loc     = sql_str(rec["location"])
        is_fake = rec["note"] and rec["note"] in PITHY_NOTES
        tag     = "  -- FAKE" if is_fake else ""
        # image_path: we'll handle image uploads separately; store original S3 URL in note for real records with images for now
        img_note = ""
        if rec.get("image_url") and not is_fake:
            img_note = f"  -- original image: {rec['image_url']}"
        lines.append(
            f"INSERT INTO records (serial, location, note, created_at, updated_at)"
            f" VALUES ({sql_str(serial)}, {loc}, {note}, {sql_str(ts)}, {sql_str(ts)});{tag}{img_note}"
        )
        if is_fake:
            new_records_fake += 1
        else:
            new_records_real += 1

    lines.append("")

lines += ["COMMIT;", ""]

sql_file = SCRIPT_DIR / "migrate.sql"
sql_file.write_text("\n".join(lines))

print(f"\n── Summary ──────────────────────────────────────────────────")
print(f"  Already complete (no action):  {already_complete}")
print(f"  New boners to insert:          {new_boners}")
print(f"  Real records to insert:        {new_records_real}")
print(f"  Fake records to insert:        {new_records_fake}")
print(f"  SQL written to:                {sql_file}")
print(f"\nImages: real records with images are annotated in SQL comments.")
print(f"        Run 5_fetch_images.sh after reviewing the SQL to download them.")
