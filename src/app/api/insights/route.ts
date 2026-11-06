import { NextRequest, NextResponse } from "next/server";
import { loadDb } from "@/lib/store";
import { createSupabaseServerClient } from "@/lib/auth";
import { requireUser } from "@/lib/auth";

export async function DELETE(req: NextRequest) {
  try {
    await requireUser();
  } catch {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id requis" }, { status: 400 });
  const db = await loadDb();
  const idx = db.insights?.findIndex((i) => i.id === id) ?? -1;
  if (idx === -1 || !db.insights) {
    return NextResponse.json({ error: "Insight not found" }, { status: 404 });
  }
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("insights").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  db.insights.splice(idx, 1);
  return NextResponse.json({ ok: true });
}
