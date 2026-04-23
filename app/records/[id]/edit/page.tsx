import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { parseAnonRecords } from "@/lib/utils";
import RecordForm from "@/components/RecordForm";
import GoogleMapsLoader from "@/components/GoogleMapsLoader";
import type { Record as BRecord } from "@/lib/types";

interface Props { params: Promise<{ id: string }> }

export default async function EditRecordPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const cookieStore = await cookies();

  const { data: { user } } = await supabase.auth.getUser();
  const anonRecords = parseAnonRecords(cookieStore.get("anon_records")?.value);

  const { data: record } = await supabase
    .from("records").select("*").eq("id", Number(id)).single();

  if (!record) notFound();

  const r = record as BRecord;

  // Auth check
  let isAdmin = false;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles").select("role").eq("id", user.id).single();
    isAdmin = profile?.role === 1;
  }

  const canEdit = isAdmin || user?.id === r.user_id || anonRecords.includes(r.id);
  if (!canEdit) redirect(`/boners/${r.serial}`);

  const redirectTo = isAdmin ? "/admin/records" : user ? "/account" : `/boners/${r.serial}`;

  return (
    <div className="space-y-4">
      <h2>EDIT BONER SIGHTING</h2>
      <GoogleMapsLoader>
        <RecordForm record={r} redirectTo={redirectTo} />
      </GoogleMapsLoader>
    </div>
  );
}
