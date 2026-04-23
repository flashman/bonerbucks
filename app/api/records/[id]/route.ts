import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { parseAnonRecords } from "@/lib/utils";
import { cookies } from "next/headers";
import { z } from "zod";

interface Ctx { params: Promise<{ id: string }> }

const UpdateSchema = z.object({
  location:   z.string().min(1).optional(),
  lat:        z.number().optional(),
  lng:        z.number().optional(),
  note:       z.string().nullable().optional(),
  image_path: z.string().nullable().optional(),
});

async function authorise(supabase: Awaited<ReturnType<typeof createClient>>, recordId: number) {
  const cookieStore = await cookies();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: record } = await supabase
    .from("records").select("user_id").eq("id", recordId).single();
  if (!record) return { ok: false, status: 404, msg: "Not found" };

  const anonIds = parseAnonRecords(cookieStore.get("anon_records")?.value);
  const isOwner = user?.id === record.user_id;
  const isAnon  = anonIds.includes(recordId);

  let isAdmin = false;
  if (user) {
    const { data: p } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    isAdmin = p?.role === 1;
  }

  if (!isOwner && !isAnon && !isAdmin) return { ok: false, status: 403, msg: "Forbidden" };
  return { ok: true, status: 200, msg: "" };
}

export async function PATCH(req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  const recordId = Number(id);
  const supabase = await createClient();

  const auth = await authorise(supabase, recordId);
  if (!auth.ok) return NextResponse.json({ error: auth.msg }, { status: auth.status });

  const body = await req.json().catch(() => null);
  const parsed = UpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 422 });
  }

  // Use the service client for the write — our authorise() above already confirmed
  // permission. The anon-key client would be silently blocked by RLS for records
  // where user_id is null (anon sightings tracked by cookie), since
  // `null = null` is false in SQL's owner-update policy.
  const serviceClient = createServiceClient();
  const { data, error } = await serviceClient
    .from("records")
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq("id", recordId)
    .select();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data?.[0] ?? null);
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  const recordId = Number(id);
  const supabase = await createClient();

  const auth = await authorise(supabase, recordId);
  if (!auth.ok) return NextResponse.json({ error: auth.msg }, { status: auth.status });

  // Grab serial before deletion so we can clean up orphan boners
  const { data: record } = await supabase
    .from("records").select("serial, image_path").eq("id", recordId).single();

  const { error } = await supabase.from("records").delete().eq("id", recordId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Delete image from Storage if present
  if (record?.image_path) {
    await supabase.storage.from("record-images").remove([record.image_path]);
  }

  // Remove boner if it has no more records
  if (record?.serial) {
    const { count } = await supabase
      .from("records").select("*", { count: "exact", head: true }).eq("serial", record.serial);
    if (count === 0) {
      await supabase.from("boners").delete().eq("serial", record.serial);
    }
  }

  return new NextResponse(null, { status: 204 });
}
