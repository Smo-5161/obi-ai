import { NextRequest, NextResponse } from "next/server";
import { loadDb, saveDb } from "@/lib/store";
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
  const [removed] = db.insights.splice(idx, 1);
  await saveDb(db);
  void removed;
  return NextResponse.json({ ok: true });
}
