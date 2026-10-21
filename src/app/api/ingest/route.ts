import { NextRequest, NextResponse } from "next/server";
import { loadDb } from "@/lib/store";
import { requireUser } from "@/lib/auth";
import { runIngestionPipeline } from "@/lib/pipeline";
import { transcribeAudio } from "@/lib/mistral";
import { z } from "zod";

const actionSchema = z.object({
  timestamp: z.number(),
  type: z.enum(["click", "input", "navigate", "shortcut"]),
  app: z.string().optional(),
  target: z.string().optional(),
  url: z.string().optional(),
  text: z.string().optional(),
});

export async function POST(req: NextRequest) {
  let user;
  try {
    user = await requireUser();
  } catch {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  const form = await req.formData();
  const brainId = form.get("brainId") as string | null;
  const title = form.get("title") as string | null;
  const durationSec = Number(form.get("durationSec") ?? 0);
  const actionsRaw = form.get("actions") as string | null;
  const transcriptRaw = form.get("transcript") as string | null;
  const audio = form.get("audio");

  if (!brainId || !title || durationSec <= 0) {
    return NextResponse.json(
      { error: "brainId, title et durationSec requis" },
      { status: 400 },
    );
  }

  const parsedActions = actionsRaw
    ? actionSchema.array().safeParse(JSON.parse(actionsRaw))
    : { success: true as const, data: [] as z.infer<typeof actionSchema>[] };
  if (!parsedActions.success) {
    return NextResponse.json({ error: "Actions invalides" }, { status: 400 });
  }

  const db = await loadDb();
  const brain = db.brains.find((b) => b.id === brainId);
  if (!brain) return NextResponse.json({ error: "Brain not found" }, { status: 404 });

  // 1) STT : l'audio a priorité ; sinon transcript textuel fourni
  let transcript: { start: number; end: number; text: string }[] = [];
  if (audio instanceof Blob && audio.size > 1024) {
    const segments = await transcribeAudio(audio, durationSec);
    if (segments) transcript = segments;
  }
  if (!transcript.length && transcriptRaw) {
    transcript = transcriptRaw
      .split(/\n+/)
      .map((t) => t.trim())
      .filter(Boolean)
      .map((text, i) => ({ start: (i * durationSec) / 3, end: ((i + 1) * durationSec) / 3, text }));
  }
  if (!transcript.length) {
    return NextResponse.json(
      {
        error:
          "Aucun commentaire vocal détecté. Enregistrez avec le micro actif, ou fournissez un texte.",
      },
      { status: 422 },
    );
  }

  // 2) Pipeline existant : structuration, redaction PII, embeddings
  const recording = await runIngestionPipeline(db, brainId, {
    title,
    durationSec,
    transcript,
    actionLogs: parsedActions.data,
  });

  void user;
  return NextResponse.json(recording, { status: 201 });
}
