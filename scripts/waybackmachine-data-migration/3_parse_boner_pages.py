#!/usr/bin/env python3
"""
Parse individual boner detail pages (fetched to tmp/boners/*.html).
Handles two page formats:
  - Old Rails HTML (2021 snapshot, if available)
  - Current Next.js pages (embed JSON record data in <script> tags)

Output: tmp/boners_records.csv
Columns: serial, record_id, location, note, lat, lng, image_url, created_at
"""
import csv
import json
import re
import sys
from pathlib import Path
from bs4 import BeautifulSoup

BONERS_DIR = Path(__file__).parent / "boners"
OUT_FILE   = Path(__file__).parent / "boners_records.csv"

FIELDNAMES = ["serial", "record_id", "location", "note", "lat", "lng", "image_url", "created_at"]

def extract_records_nextjs(serial, html):
    """Extract records from Next.js RSC payload embedded in <script> tags."""
    records = []
    # The Next.js page embeds record JSON in self.__next_f.push([1, "..."]) calls.
    # Look for record objects with the shape {"id":..., "serial":..., "location":...}
    pattern = re.compile(
        r'"record"\s*:\s*(\{[^{}]*"serial"\s*:\s*"[A-Z][0-9]{8}[A-Z]"[^{}]*\})',
        re.DOTALL
    )
    for m in pattern.finditer(html):
        try:
            obj = json.loads(m.group(1))
        except json.JSONDecodeError:
            continue
        if obj.get("serial") != serial:
            continue

        # image_url: prefer large_url, fall back to image_path
        image_url = obj.get("large_url") or obj.get("image_path") or ""

        records.append({
            "serial":     serial,
            "record_id":  obj.get("id", ""),
            "location":   obj.get("location", ""),
            "note":       obj.get("note", ""),
            "lat":        obj.get("lat", ""),
            "lng":        obj.get("lng", ""),
            "image_url":  image_url,
            "created_at": obj.get("created_at", ""),
        })

    return records


def extract_records_rails(serial, soup):
    """Extract records from old Rails HTML page structure."""
    records = []
    # Old Rails boner page had a table of sightings
    table = soup.find("table", class_="sortable")
    if not table:
        return records

    for row in table.find_all("tr"):
        cells = row.find_all("td")
        if len(cells) < 4:
            continue

        date_raw = cells[0].get("data-sort", "").strip()
        location = cells[1].get_text(strip=True)
        note     = cells[2].get_text(strip=True) if len(cells) > 2 else ""

        # Image
        image_url = ""
        if len(cells) > 3:
            img_tag = cells[3].find("a", class_="fancybox")
            if img_tag:
                href = img_tag.get("href", "")
                m = re.search(r"https?://web\.archive\.org/web/\d+/(http.+)", href)
                image_url = m.group(1).split("?")[0] if m else href.split("?")[0]

        records.append({
            "serial":     serial,
            "record_id":  "",
            "location":   location,
            "note":       note,
            "lat":        "",
            "lng":        "",
            "image_url":  image_url,
            "created_at": f"{date_raw}T00:00:00+00:00" if date_raw else "",
        })

    return records


all_records = []
skipped = []

for html_file in sorted(BONERS_DIR.glob("*.html")):
    serial = html_file.stem
    if not re.match(r"^[A-Z][0-9]{8}[A-Z]$", serial):
        continue

    html = html_file.read_text(errors="replace")
    soup = BeautifulSoup(html, "html.parser")

    # Try Next.js format first (more reliable, includes lat/lng and exact timestamps)
    records = extract_records_nextjs(serial, html)

    if not records:
        # Fall back to Rails HTML parsing
        records = extract_records_rails(serial, soup)

    if records:
        all_records.extend(records)
        print(f"{serial}: {len(records)} record(s) (source: {'nextjs' if records[0]['record_id'] else 'rails'})")
    else:
        skipped.append(serial)
        print(f"{serial}: WARNING - no records found")

with open(OUT_FILE, "w", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=FIELDNAMES)
    writer.writeheader()
    writer.writerows(all_records)

print(f"\nWrote {len(all_records)} records for {len(all_records)} rows to {OUT_FILE}")
if skipped:
    print(f"WARNING: No records extracted for: {skipped}")
