import { NextRequest, NextResponse } from "next/server";
import { loadDb, saveDb, newId } from "@/lib/store";
import { requireUser } from "@/lib/auth";
import { z } from "zod";

const sopSchema = z.object({
  brainId: z.string().min(1),
  title: z.string().min(1),
  frequency: z.enum(["daily", "weekly", "monthly", "adhoc"]).default("adhoc"),
  steps: z
    .array(z.object({ title: z.string().min(1), instruction: z.string().optional(), tool: z.string().optional() }))
    .default([]),
  tools: z.array(z.string()).default([]),
  contacts: z.array(z.string()).default([]),
});

export async function POST(req: NextRequest) {
  let user;
  try {
    user = await requireUser();
  } catch {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }
  const body = await req.json();
  const parsed = sopSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  const db = await loadDb();
  const brain = db.brains.find((b) => b.id === parsed.data.brainId);
  if (!brain) return NextResponse.json({ error: "Brain not found" }, { status: 404 });

  const sop = {
    id: newId("sop"),
    brainId: parsed.data.brainId,
    title: parsed.data.title,
    frequency: parsed.data.frequency,
    steps: parsed.data.steps.map((st, i) => ({
      id: newId("step"),
      order: i + 1,
      title: st.title,
      instruction: st.instruction ?? st.title,
      tool: st.tool,
    })),
    tools: parsed.data.tools,
    contacts: parsed.data.contacts,
    createdAt: new Date().toISOString(),
  };
  db.sops[sop.id] = sop;
  await saveDb(db);
  void user;
  return NextResponse.json(sop, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  try {
    await requireUser();
  } catch {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }
  const sopId = req.nextUrl.searchParams.get("id");
  if (!sopId) return NextResponse.json({ error: "id requis" }, { status: 400 });
  const db = await loadDb();
  const sop = db.sops[sopId];
  if (!sop) return NextResponse.json({ error: "SOP not found" }, { status: 404 });
  delete db.sops[sopId];
  await saveDb(db);
  return NextResponse.json({ ok: true });
}

export async function PUT(req: NextRequest) {
  try {
    await requireUser();
  } catch {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }
  const body = await req.json();
  const db = await loadDb();
  const sop = db.sops[body.id];
  if (!sop) return NextResponse.json({ error: "SOP not found" }, { status: 404 });
  if (body.title) sop.title = body.title;
  if (body.frequency) sop.frequency = body.frequency;
  if (Array.isArray(body.steps)) {
    sop.steps = body.steps.map((st: { title: string; instruction?: string; tool?: string }, i: number) => ({
      id: newId("step"),
      order: i + 1,
      title: st.title,
      instruction: st.instruction ?? st.title,
      tool: st.tool,
    }));
  }
  if (Array.isArray(body.tools)) sop.tools = body.tools;
  if (Array.isArray(body.contacts)) sop.contacts = body.contacts;
  await saveDb(db);
  return NextResponse.json(sop);
}
