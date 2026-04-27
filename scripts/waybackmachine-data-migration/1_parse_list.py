#!/usr/bin/env python3
"""
Parse the Wayback Machine snapshot of the boners list page.
Output: tmp/boners_list.csv
Columns: serial, sighting_count, latest_date, latest_location, image_url
"""
import csv
import re
import sys
from pathlib import Path
from bs4 import BeautifulSoup

HTML_FILE = Path(__file__).parent / "snapshot-waybackmachine-20211218151554.html"
OUT_FILE  = Path(__file__).parent / "boners_list.csv"

with open(HTML_FILE) as f:
    soup = BeautifulSoup(f, "html.parser")

rows = soup.select("table.sortable tr")
records = []

for row in rows:
    cells = row.find_all("td")
    if not cells:
        continue

    serial = cells[0].get("data-sort", "").strip()
    if not re.match(r"^[A-Z][0-9]{8}[A-Z]$", serial):
        continue

    sighting_count = int(cells[1].get("data-sort", 1))

    # Date is malformed HTML: <td data-sort="2021-10-22" 01:36:55="" utc="">
    # The data-sort attribute only has the date part; time is lost in the bad HTML.
    # BeautifulSoup still captures the date portion correctly.
    raw_date = cells[2].get("data-sort", "").strip()
    # Reconstruct ISO datetime as noon UTC (time not preserved in list page)
    latest_date = f"{raw_date}T00:00:00+00:00" if raw_date else ""

    latest_location = cells[3].get("data-sort", "").strip()
    # The data-sort strips spaces; use text for the readable version
    latest_location_text = cells[3].get_text(strip=True)

    # Image: look for fancybox href pointing to large image
    img_tag = cells[4].find("a", class_="fancybox")
    image_url = ""
    if img_tag:
        href = img_tag.get("href", "")
        # Strip Wayback Machine wrapper to get original S3 URL
        # e.g. https://web.archive.org/web/20211218151554/http://s3.amazonaws.com/...
        m = re.search(r"https?://web\.archive\.org/web/\d+/(http.+)", href)
        if m:
            image_url = m.group(1).split("?")[0]  # remove cache-busting query string
        else:
            image_url = href.split("?")[0]

    records.append({
        "serial": serial,
        "sighting_count": sighting_count,
        "latest_date": latest_date,
        "latest_location": latest_location_text,
        "image_url": image_url,
    })

with open(OUT_FILE, "w", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=["serial", "sighting_count", "latest_date", "latest_location", "image_url"])
    writer.writeheader()
    writer.writerows(records)

print(f"Wrote {len(records)} rows to {OUT_FILE}")
multi = [r for r in records if r["sighting_count"] > 1]
print(f"Multi-sighting serials ({len(multi)}): {[r['serial'] for r in multi]}")
