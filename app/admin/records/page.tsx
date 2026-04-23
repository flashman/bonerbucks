import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import type { Record as BRecord } from "@/lib/types";
import AdminDeleteButton from "@/components/AdminDeleteButton";

export const metadata = { title: "Admin — All Records" };

export default async function AdminRecordsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== 1) redirect("/");

  const { data: records, error } = await supabase
    .from("records").select("*").order("id");

  return (
    <div className="space-y-4">
      <h2>ALL RECORDS (ADMIN)</h2>
      {error && <p className="error">{error.message}</p>}

      <table className="sortable w-full text-sm">
        <thead>
          <tr>
            <th className="w-12">ID</th>
            <th className="w-28">DATE</th>
            <th className="w-28">SERIAL</th>
            <th>CITY</th>
            <th className="w-32">LAT / LNG</th>
            <th className="w-24"></th>
          </tr>
        </thead>
        <tbody>
          {(records ?? []).map((r: BRecord) => (
            <tr key={r.id}>
              <td className="w-12 text-gray-400">{r.id}</td>
              <td className="w-28">{formatDate(r.created_at)}</td>
              <td className="w-28">
                <Link href={`/boners/${r.serial}`}>{r.serial}</Link>
              </td>
              <td>{r.location}</td>
              <td className="w-32 text-xs text-gray-500">
                {r.lat != null ? `${r.lat.toFixed(2)}, ${r.lng?.toFixed(2)}` : "—"}
              </td>
              <td className="w-24 text-xs space-x-1">
                <Link href={`/records/${r.id}/edit`} className="underline">EDIT</Link>
                <span>|</span>
                <AdminDeleteButton id={r.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
