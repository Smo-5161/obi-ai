import { NextRequest, NextResponse } from "next/server";
import { loadDb, saveDb, newId } from "@/lib/store";
import type { Brain } from "@/lib/types";

export async function GET() {
  const db = await loadDb();
  return NextResponse.json(db.brains);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const brain: Brain = {
    id: newId("brain"),
    name: body.name,
    owner: body.owner || "",
    scope: body.scope || "job",
    description: body.description || "",
    referenceDuties: body.referenceDuties || [],
    createdAt: new Date().toISOString(),
  };
  const db = await loadDb();
  db.brains.push(brain);
  await saveDb(db);
  return NextResponse.json(brain, { status: 201 });
}
