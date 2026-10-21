import { NextRequest, NextResponse } from "next/server";
import { loadDb, saveDb } from "@/lib/store";
import { runIngestionPipeline } from "@/lib/pipeline";
import { requireUser } from "@/lib/auth";
import { z } from "zod";

const recordingSchema = z.object({
  brainId: z.string().min(1),
  title: z.string().min(1),
  durationSec: z.number().min(1),
  transcript: z
    .array(z.object({ start: z.number(), end: z.number(), text: z.string() }))
    .min(1),
  actionLogs: z.array(
    z.object({
      timestamp: z.number(),
      type: z.enum(["click", "input", "navigate", "shortcut"]),
      app: z.string().optional(),
      target: z.string().optional(),
      url: z.string().optional(),
      text: z.string().optional(),
    }),
  ),
});

export async function GET(req: NextRequest) {
  try {
    await requireUser();
  } catch {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }
  const db = await loadDb();
  const brainId = req.nextUrl.searchParams.get("brainId");
  const list = Object.values(db.recordings).filter(
    (r) => !brainId || r.brainId === brainId,
  );
  return NextResponse.json(list);
}

export async function POST(req: NextRequest) {
  try {
    await requireUser();
  } catch {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }
  const body = await req.json();
  const parsed = recordingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", details: parsed.error.issues }, { status: 400 });
  }
  const db = await loadDb();
  const brain = db.brains.find((b) => b.id === parsed.data.brainId);
  if (!brain) return NextResponse.json({ error: "Brain not found" }, { status: 404 });
  const recording = await runIngestionPipeline(db, parsed.data.brainId, parsed.data);
  return NextResponse.json(recording, { status: 201 });
}

export async function PUT(req: NextRequest) {
  try {
    await requireUser();
  } catch {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }
  const body = await req.json();
  const db = await loadDb();
  const sop = db.sops[body.sopId];
  const progressId = body.inboarderName;
  if (!sop || !progressId) {
    return NextResponse.json({ error: "Missing sopId or inboarderName" }, { status: 400 });
  }
  const progress =
    db.progress[progressId] ||
    (db.progress[progressId] = {
      inboarderName: progressId,
      brainId: sop.brainId,
      completedSopIds: [],
      askedQuestions: 0,
      blockingTopics: {},
    });
  progress.completedSopIds = [...new Set([...progress.completedSopIds, sop.id])];
  await saveDb(db);
  return NextResponse.json(progress);
}
