import { NextRequest, NextResponse } from "next/server";
import { loadDb } from "@/lib/store";
import { buildDependencyGraph, brainCoverage } from "@/lib/pipeline";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
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
    graph: buildDependencyGraph(db, id),
    coverage: brainCoverage(db, brain),
  });
}
