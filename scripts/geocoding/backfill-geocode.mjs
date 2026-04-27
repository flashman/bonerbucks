#!/usr/bin/env node
// Fetches records with a location name but no lat/lng, geocodes them via Nominatim,
// and updates the DB. Run: node scripts/backfill-geocode.mjs
// Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local

import { readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";

// Load .env.local
const envPath = new URL("../.env.local", import.meta.url).pathname;
const env = Object.fromEntries(
  readFileSync(envPath, "utf8")
    .split("\n")
    .filter((l) => l.trim() && !l.startsWith("#"))
    .map((l) => l.split("=").map((p) => p.trim()))
    .filter(([k]) => k)
    .map(([k, ...rest]) => [k, rest.join("=").replace(/\s+#.*$/, "")])
);

const supabaseUrl = env["NEXT_PUBLIC_SUPABASE_URL"];
const serviceKey = env["SUPABASE_SERVICE_ROLE_KEY"];

if (!supabaseUrl || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

async function geocode(location) {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`;
  const res = await fetch(url, {
    headers: { "User-Agent": "bonerbucks/2.0 (https://bonerbucks.com)" },
  });
  if (!res.ok) throw new Error(`Nominatim HTTP ${res.status}`);
  const data = await res.json();
  const first = data[0] ?? null;
  if (!first) return null;
  return { lat: parseFloat(first.lat), lng: parseFloat(first.lon), display_name: first.display_name };
}

// Nominatim ToS: max 1 req/sec
function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const { data: records, error } = await supabase
    .from("records")
    .select("id, location")
    .not("location", "is", null)
    .neq("location", "")
    .is("lat", null);

  if (error) {
    console.error("Failed to fetch records:", error.message);
    process.exit(1);
  }

  console.log(`Found ${records.length} records to geocode.\n`);

  let updated = 0;
  let skipped = 0;

  for (const record of records) {
    process.stdout.write(`[${record.id}] "${record.location}" → `);

    let result;
    try {
      result = await geocode(record.location);
    } catch (err) {
      console.log(`ERROR: ${err.message}`);
      await sleep(1000);
      continue;
    }

    if (!result) {
      console.log("no match, skipping");
      skipped++;
    } else {
      console.log(`${result.lat}, ${result.lng}  (${result.display_name})`);
      const { error: updateError } = await supabase
        .from("records")
        .update({ lat: result.lat, lng: result.lng })
        .eq("id", record.id);
      if (updateError) {
        console.log(`  UPDATE FAILED: ${updateError.message}`);
      } else {
        updated++;
      }
    }

    await sleep(1100); // respect Nominatim 1 req/sec limit
  }

  console.log(`\nDone. Updated: ${updated}, No match: ${skipped}`);
}

main();
