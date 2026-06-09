import { NextResponse } from "next/server";

const HEADERS = { "User-Agent": "bonerbucks/2.0 (https://bonerbucks.com)" };

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const q = searchParams.get("q");

  // Reverse geocode: coords → city name
  if (lat && lng) {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;
    const res = await fetch(url, { headers: HEADERS });
    if (!res.ok) return NextResponse.json({ error: "geocoder unavailable" }, { status: 502 });
    const data = await res.json();
    const a = data.address ?? {};
    const city = a.city ?? a.town ?? a.village ?? a.county ?? "";
    const region = a.state ?? a.country ?? "";
    const display_name = [city, region].filter(Boolean).join(", ");
    return NextResponse.json({
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      display_name,
    });
  }

  // Forward geocode: city name → coords
  if (!q?.trim()) {
    return NextResponse.json({ error: "missing q" }, { status: 400 });
  }

  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1`;
  const res = await fetch(url, { headers: HEADERS, next: { revalidate: 86400 } });

  if (!res.ok) return NextResponse.json({ error: "geocoder unavailable" }, { status: 502 });

  const data = await res.json();
  const first = data[0] ?? null;
  if (!first) return NextResponse.json(null);

  return NextResponse.json({
    lat: parseFloat(first.lat),
    lng: parseFloat(first.lon),
    display_name: first.display_name,
  });
}
