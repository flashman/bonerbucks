import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { imageUrl, formatDate, parseAnonRecords } from "@/lib/utils";
import BonerRecordRow from "@/components/BonerRecordRow";
import type { Record as BRecord } from "@/lib/types";

interface Props {
  params: Promise<{ serial: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { serial } = await params;
  return { title: `Boner ${serial.toUpperCase()} — Bonerbucks` };
}

export default async function BonerShowPage({ params }: Props) {
  const { serial } = await params;
  const normSerial = serial.toUpperCase();

  const supabase = await createClient();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const cookieStore = await cookies();

  const { data: { user } } = await supabase.auth.getUser();

  let isAdmin = false;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles").select("role").eq("id", user.id).single();
    isAdmin = profile?.role === 1;
  }

  const anonRecords = parseAnonRecords(cookieStore.get("anon_records")?.value);

  const { data: boner } = await supabase
    .from("boners").select("*").eq("serial", normSerial).single();

  if (!boner) notFound();

  const { data: records } = await supabase
    .from("records")
    .select("*")
    .eq("serial", normSerial)
    .order("created_at", { ascending: false });

  const enriched = (records ?? []).map((r: BRecord) => ({
    ...r,
    thumb_url: r.image_path ? imageUrl(supabaseUrl, r.image_path, "thumb") : null,
    large_url: r.image_path ? imageUrl(supabaseUrl, r.image_path, "large") : null,
    canEdit: isAdmin || (user?.id === r.user_id) || anonRecords.includes(r.id),
  }));

  return (
    <div className="space-y-6">
      <h2>THIS IS BONER NUMBER {normSerial}</h2>

      <h4>LAST SEEN...</h4>

      <table className="sortable w-full text-sm">
        <thead>
          <tr>
            <th className="w-28">DATE</th>
            <th className="w-36">CITY</th>
            <th>NOTES</th>
            <th className="w-24">PIC</th>
            <th className="w-24"></th>
          </tr>
        </thead>
        <tbody>
          {enriched.map((r) => (
            <BonerRecordRow key={r.id} record={r} />
          ))}
          {enriched.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center py-4 text-gray-500">
                NO SIGHTINGS YET.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <h3>
        HAVE YOU SEEN THIS BONER?{" "}
        <Link href={`/boners/new/${normSerial}`}>LET US KNOW</Link>
      </h3>
    </div>
  );
}
