import { NextRequest, NextResponse } from "next/server";
import { loadDb } from "@/lib/store";
import { requireUser } from "@/lib/auth";
import { buildDependencyGraph, brainCoverage } from "@/lib/pipeline";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireUser();
  } catch {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }
  const { id } = await params;
  const db = await loadDb();
  const brain = db.brains.find((b) => b.id === id);
  if (!brain) return NextResponse.json({ error: "Brain not found" }, { status: 404 });
  const sops = Object.values(db.sops).filter((s) => s.brainId === id);
  const recordings = Object.values(db.recordings).filter((r) => r.brainId === id);
  return NextResponse.json({
    brain,
    sops,
    recordings,
    insights: db.insights?.filter((i) => i.brainId === id) ?? [],
    graph: buildDependencyGraph(db, id),
    coverage: brainCoverage(db, brain),
  });
}
