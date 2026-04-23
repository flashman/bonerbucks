import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { imageUrl, formatDate } from "@/lib/utils";
import type { Record as BRecord } from "@/lib/types";
import AccountDeleteButton from "@/components/AccountDeleteButton";

export const metadata = { title: "My Boners — Bonerbucks" };

export default async function AccountPage() {
  const supabase = await createClient();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles").select("name, role").eq("id", user.id).single();

  const { data: records } = await supabase
    .from("records")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const isAdmin = profile?.role === 1;

  const enriched = (records ?? []).map((r: BRecord) => ({
    ...r,
    thumb_url: r.image_path ? imageUrl(supabaseUrl, r.image_path, "thumb") : null,
    large_url: r.image_path ? imageUrl(supabaseUrl, r.image_path, "large") : null,
    canEdit: true, // this page only shows the user's own records
  }));

  return (
    <div className="space-y-6">
      <h2>{(profile?.name ?? "YOUR").toUpperCase()}&apos;S BONERS</h2>

      {isAdmin && (
        <p className="notice">YOU ARE AN ADMIN. <Link href="/admin/records">VIEW ALL RECORDS</Link></p>
      )}

      <table className="sortable w-full text-sm">
        <thead>
          <tr>
            <th className="w-28">SERIAL</th>
            <th className="w-28">DATE</th>
            <th>CITY</th>
            <th>NOTES</th>
            <th className="w-24">PIC</th>
            <th className="w-24"></th>
          </tr>
        </thead>
        <tbody>
          {enriched.map((r) => (
            <tr key={r.id}>
              <td className="w-28">
                <Link href={`/boners/${r.serial}`}>{r.serial}</Link>
              </td>
              <td className="w-28">{formatDate(r.created_at)}</td>
              <td>{r.location}</td>
              <td>{r.note}</td>
              <td className="w-24">
                {r.thumb_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={r.thumb_url} alt="sighting" className="h-10 object-contain" />
                )}
              </td>
              <td className="w-24 text-xs space-x-1">
                <Link href={`/records/${r.id}/edit`} className="underline">EDIT</Link>
                <span>|</span>
                <AccountDeleteButton id={r.id} serial={r.serial} />
              </td>
            </tr>
          ))}
          {enriched.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center py-4 text-gray-500">
                YOU HAVE NO BONERS YET.{" "}
                <Link href="/boners/new">REPORT ONE</Link>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
