#!/usr/bin/env bash
# Curl individual boner detail pages from the live bonerbucks.org site.
# The Wayback Machine 2021 snapshot didn't crawl individual boner pages,
# but the current Next.js site embeds full JSON record data in the page.
#
# Usage: bash 2_fetch_boner_pages.sh
#
# Output: tmp/boners/[serial].html for each serial in boners_list.csv

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CSV="$SCRIPT_DIR/boners_list.csv"
OUT_DIR="$SCRIPT_DIR/boners"
mkdir -p "$OUT_DIR"

# Only fetch detail pages for multi-sighting serials (sighting_count > 1)
# Single-sighting serials have all info in the list CSV already.
tail -n +2 "$CSV" | while IFS=',' read -r serial sighting_count latest_date latest_location image_url; do
    if [[ "$sighting_count" -le 1 ]]; then
        continue
    fi
    out_file="$OUT_DIR/${serial}.html"
    if [[ -f "$out_file" && -s "$out_file" ]]; then
        echo "SKIP $serial (already fetched)"
        continue
    fi

    url="https://web.archive.org/web/20211218151554/http://bonerbucks.org/boners/${serial}"
    echo "Fetching $serial from $url ..."

    # Follow redirects; Wayback Machine may serve current site if 2021 snapshot absent
    if curl -s -L --max-time 30 \
        -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" \
        "$url" -o "$out_file"; then
        size=$(wc -c < "$out_file")
        echo "  -> saved ${size} bytes"
    else
        echo "  -> FAILED, removing partial file"
        rm -f "$out_file"
    fi

    # Be polite to the Wayback Machine
    sleep 1
done

echo ""
echo "Done. Files in $OUT_DIR:"
ls "$OUT_DIR" | wc -l
