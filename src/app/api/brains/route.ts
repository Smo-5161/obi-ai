import { NextRequest, NextResponse } from "next/server";
import { loadDb, saveDb, newId } from "@/lib/store";
import { requireUser } from "@/lib/auth";
import { planFor, isAdmin } from "@/lib/plans";
import { createSupabaseServerClient } from "@/lib/auth";
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
  const db = await loadDb();

  // Mode poste partagé : si un brain de poste porte déjà ce nom, le rejoindre
  if (body.joinOrCreate) {
    const existing = db.brains.find(
      (b) => b.name.toLowerCase() === String(body.name).toLowerCase() && b.scope === "job",
    );
    if (existing) {
      const supabase = await createSupabaseServerClient();
      const { error: memberErr } = await supabase.from("brain_members").upsert({
        brain_id: existing.id,
        user_id: user.id,
      });
      if (memberErr) {
        return NextResponse.json({ error: "Impossible de rejoindre le poste : " + memberErr.message }, { status: 500 });
      }
      return NextResponse.json({ ...existing, joined: true }, { status: 200 });
    }
  }

  const limits = planFor(user.email);
  const myBrains = db.brains.filter((b) => b.ownerId === user.id).length;
  if (!isAdmin(user.email) && myBrains >= limits.maxBrains) {
    return NextResponse.json(
      { error: "Limite du plan atteinte : " + limits.maxBrains + " Brain(s). Passez au plan Team pour plus." },
      { status: 402 },
    );
  }

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

  // le créateur devient aussi membre
  const supabase = await createSupabaseServerClient();
  db.brains.push(brain);
  await saveDb(db);
  await supabase.from("brain_members").upsert({
    brain_id: brain.id,
    user_id: user.id,
  });
  return NextResponse.json(brain, { status: 201 });
}
