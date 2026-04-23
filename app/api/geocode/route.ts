import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");

  if (!q?.trim()) {
    return NextResponse.json({ error: "missing q" }, { status: 400 });
  }

  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1`;

  const res = await fetch(url, {
    headers: {
      // Nominatim requires a User-Agent identifying your app
      "User-Agent": "bonerbucks/2.0 (https://bonerbucks.com)",
    },
    next: { revalidate: 86400 }, // cache geocode results for 24h
  });

  if (!res.ok) {
    return NextResponse.json({ error: "geocoder unavailable" }, { status: 502 });
  }

  const data = await res.json();
  const first = data[0] ?? null;

  if (!first) {
    return NextResponse.json(null);
  }

  return NextResponse.json({
    lat: parseFloat(first.lat),
    lng: parseFloat(first.lon),
    display_name: first.display_name,
  });
}
