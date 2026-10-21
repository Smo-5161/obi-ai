import { NextRequest, NextResponse } from "next/server";
import { loadDb, saveDb, newId } from "@/lib/store";
import { requireUser } from "@/lib/auth";
import { planFor } from "@/lib/plans";
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
  let user;
  try {
    user = await requireUser();
  } catch {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }
  const body = await req.json();
  const brain: Brain = {
    id: newId("brain"),
    name: body.name,
    ownerId: user.id,
    owner: body.owner || "",
    scope: body.scope || "job",
    description: body.description || "",
    referenceDuties: body.referenceDuties || [],
    createdAt: new Date().toISOString(),
  };
  const db = await loadDb();
  const limits = planFor(user.email);
  if (db.brains.length >= limits.maxBrains) {
    return NextResponse.json(
      { error: "Limite du plan atteinte : " + limits.maxBrains + " Brain(s). Passez au plan Team pour plus." },
      { status: 402 },
    );
  }
  db.brains.push(brain);
  await saveDb(db);
  return NextResponse.json(brain, { status: 201 });
}
