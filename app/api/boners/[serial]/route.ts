import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface Ctx { params: Promise<{ serial: string }> }

export async function GET(_req: Request, ctx: Ctx) {
  const { serial } = await ctx.params;
  const supabase = await createClient();

  const { data: boner, error: e1 } = await supabase
    .from("boners").select("*").eq("serial", serial.toUpperCase()).single();
  if (e1 || !boner) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { data: records } = await supabase
    .from("records").select("*").eq("serial", boner.serial).order("created_at", { ascending: false });

  return NextResponse.json({ ...boner, records: records ?? [] });
}
