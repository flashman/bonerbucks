#!/usr/bin/env bash
# Download images from original S3 bucket for records that have them.
# Reads image URLs from migrate.sql comments (lines with "-- original image:").
# Saves to tmp/images/[slug].[ext]
#
# After reviewing, upload to Supabase Storage and update records.image_path.
#
# Usage: bash 5_fetch_images.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SQL="$SCRIPT_DIR/migrate.sql"
OUT_DIR="$SCRIPT_DIR/images"
mkdir -p "$OUT_DIR"

grep 'image: http' "$SQL" | sed 's/.*image: //' | while read -r url; do
    # Derive a filename from the URL path
    # e.g. http://s3.amazonaws.com/bonerbucks-s3-assets/images/278/large.jpeg -> 278_large.jpeg
    slug=$(echo "$url" | grep -oE 'images/[0-9]+/[a-zA-Z]+\.[a-zA-Z]+' | tr '/' '_')
    if [[ -z "$slug" ]]; then
        slug=$(basename "$url" | sed 's/[^a-zA-Z0-9._-]/_/g')
    fi

    out_file="$OUT_DIR/${slug}"
    if [[ -f "$out_file" && -s "$out_file" ]]; then
        echo "SKIP $slug (already downloaded)"
        continue
    fi

    echo "Fetching $url -> $slug ..."
    if curl -s -L --max-time 30 "$url" -o "$out_file"; then
        size=$(wc -c < "$out_file")
        echo "  -> ${size} bytes"
    else
        echo "  -> FAILED"
        rm -f "$out_file"
    fi

    sleep 0.5
done

echo ""
echo "Done. Images in $OUT_DIR:"
ls "$OUT_DIR" 2>/dev/null | head -20
