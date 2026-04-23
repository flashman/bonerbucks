import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { imageUrl, formatDate } from "@/lib/utils";
import type { MapData, MapRecord } from "@/lib/types";

export const revalidate = 60;

export async function GET() {
  const supabase = await createClient();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;

  const { data: boners, error } = await supabase
    .from("boners")
    .select("serial, records(id, serial, lat, lng, location, created_at, note, image_path)");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const mapData: MapData = [];

  for (const boner of boners ?? []) {
    const records = (boner.records as unknown as Array<{
      id: number; serial: string; lat: number | null; lng: number | null;
      location: string; created_at: string; note: string | null; image_path: string | null;
    }>);
    if (!records || records.length === 0) continue;

    const bonerRecords: MapRecord[] = records
      .filter((r) => r.lat != null && r.lng != null)
      .map((r) => ({
        serial: r.serial,
        lat: r.lat!,
        lng: r.lng!,
        location: r.location,
        date: formatDate(r.created_at),
        note: r.note,
        thumb_url: r.image_path ? imageUrl(supabaseUrl, r.image_path, "thumb") : null,
        large_url: r.image_path ? imageUrl(supabaseUrl, r.image_path, "large") : null,
      }));

    if (bonerRecords.length > 0) mapData.push(bonerRecords);
  }

  return NextResponse.json(mapData, {
    headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
  });
}
