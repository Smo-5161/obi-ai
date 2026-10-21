import { NextRequest, NextResponse } from "next/server";
import { loadDb, saveDb, newId } from "@/lib/store";
import { requireUser } from "@/lib/auth";
import type { Brain } from "@/lib/types";

export async function GET() {
  try {
    await requireUser();
  } catch {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }
  const db = await loadDb();
  return NextResponse.json(db.brains);
}

export async function POST(req: NextRequest) {
  let userId: string;
  try {
    userId = (await requireUser()).id;
  } catch {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }
  const body = await req.json();
  const brain: Brain = {
    id: newId("brain"),
    name: body.name,
    ownerId: userId,
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
