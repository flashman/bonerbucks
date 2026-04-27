import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { normaliseSerial, isValidSerial, parseAnonRecords } from "@/lib/utils";
import { z } from "zod";
import { cookies } from "next/headers";

const CreateSchema = z.object({
  serial:    z.string().transform(normaliseSerial).refine(isValidSerial, { message: "Invalid serial format" }),
  location:  z.string().min(1, "Location required"),
  lat:       z.number({ invalid_type_error: "lat required" }),
  lng:       z.number({ invalid_type_error: "lng required" }),
  note:      z.string().nullable().optional(),
  image_path: z.string().nullable().optional(),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

  const parsed = CreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors.map((e) => e.message).join(". ") }, { status: 422 });
  }

  const { serial, location, lat, lng, note, image_path } = parsed.data;
  const supabase = await createClient();
  const cookieStore = await cookies();

  const { data: { user } } = await supabase.auth.getUser();

  // Upsert the boner (create if not exists)
  const { error: bonerErr } = await supabase
    .from("boners")
    .upsert({ serial }, { onConflict: "serial", ignoreDuplicates: true });

  if (bonerErr) {
    return NextResponse.json({ error: "BONER SERIAL INVALID: " + bonerErr.message }, { status: 422 });
  }

  const { data: record, error: recErr } = await supabase
    .from("records")
    .insert({ serial, location, lat, lng, note: note ?? null, image_path: image_path ?? null, user_id: user?.id ?? null })
    .select()
    .single();

  if (recErr || !record) {
    return NextResponse.json({ error: recErr?.message ?? "Insert failed" }, { status: 500 });
  }

  // Track anon sighting in cookie so the creator can edit it later
  if (!user) {
    const existing = cookieStore.get("anon_records")?.value;
    const ids: number[] = parseAnonRecords(existing);
    ids.push(record.id);
    const res = NextResponse.json(record, { status: 201 });
    res.cookies.set("anon_records", JSON.stringify(ids), {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: "lax",
      path: "/",
    });
    return res;
  }

  return NextResponse.json(record, { status: 201 });
}
