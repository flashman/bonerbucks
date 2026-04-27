import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { imageUrl, formatDate } from "@/lib/utils";
import type { BonerWithStats } from "@/lib/types";
import BonersClient from "@/components/BonersClient";

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
    last_seen_raw: b.last_seen_at ?? null,
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
      <BonersClient rows={rows} error={error?.message} />

      <h3>
        CAN&apos;T FIND YOUR BONER?{" "}
        <Link href="/boners/new">ADD IT TO THE LIST</Link>
      </h3>
    </div>
  );
}
