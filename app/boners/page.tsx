import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { imageUrl, formatDate } from "@/lib/utils";
import type { BonerWithStats } from "@/lib/types";
import SortableTable from "@/components/SortableTable";

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function BonersPage({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const supabase = await createClient();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;

  const { data, error } = await supabase
    .from("boners_with_stats")
    .select("*")
    .gt("sighting_count", 0)
    .order("serial");

  const boners: BonerWithStats[] = data ?? [];

  let rows = boners.map((b) => ({
    serial: b.serial,
    sightings: b.sighting_count,
    last_seen: b.last_seen_at ? formatDate(b.last_seen_at) : "—",
    last_seen_raw: b.last_seen_at ?? null,
    location: b.last_location ?? "—",
    thumb_url: b.first_image_path
      ? imageUrl(supabaseUrl, b.first_image_path, "thumb")
      : null,
    large_url: b.first_image_path
      ? imageUrl(supabaseUrl, b.first_image_path, "large")
      : null,
  }));

  if (q) {
    const query = q.toLowerCase();
    rows = rows.filter(
      (r) => r.serial.toLowerCase().includes(query) || r.location.toLowerCase().includes(query)
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2>TRACKED BONERS</h2>
        {q && (
          <p style={{ fontFamily: '"futura","univers","helvetica",sans-serif', fontWeight: "bold", fontSize: 12, color: "#aaa", textAlign: "center", marginTop: 4 }}>
            RESULTS FOR &ldquo;{q.toUpperCase()}&rdquo; | <Link href="/boners" style={{ color: "#aaa" }}>CLEAR</Link>
          </p>
        )}
      </div>

      {error && <p className="error">{error.message}</p>}

      <SortableTable rows={rows} />

      <h3>
        CAN&apos;T FIND YOUR BONER?{" "}
        <Link href="/boners/new">ADD IT TO THE LIST</Link>
      </h3>
    </div>
  );
}
