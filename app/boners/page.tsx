import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { imageUrl, formatDate } from "@/lib/utils";
import type { BonerWithStats } from "@/lib/types";
import SortableTable from "@/components/SortableTable";

export const revalidate = 30;

export default async function BonersPage() {
  const supabase = await createClient();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;

  const { data, error } = await supabase
    .from("boners_with_stats")
    .select("*")
    .gt("sighting_count", 0)
    .order("serial");

  const boners: BonerWithStats[] = data ?? [];

  const rows = boners.map((b) => ({
    serial: b.serial,
    sightings: b.sighting_count,
    last_seen: b.last_seen_at ? formatDate(b.last_seen_at) : "—",
    location: b.last_location ?? "—",
    thumb_url: b.first_image_path
      ? imageUrl(supabaseUrl, b.first_image_path, "thumb")
      : null,
    large_url: b.first_image_path
      ? imageUrl(supabaseUrl, b.first_image_path, "large")
      : null,
  }));

  return (
    <div className="space-y-6">
      <h2>TRACKED BONERS</h2>

      {error && <p className="error">{error.message}</p>}

      <SortableTable rows={rows} />

      <h3>
        CAN&apos;T FIND YOUR BONER?{" "}
        <Link href="/boners/new">ADD IT TO THE LIST</Link>
      </h3>
    </div>
  );
}
