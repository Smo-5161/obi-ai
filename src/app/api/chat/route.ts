import { NextRequest, NextResponse } from "next/server";
import { loadDb, newId, saveDb } from "@/lib/store";
import { askObi } from "@/lib/companion";
import { requireUser } from "@/lib/auth";
import type { ChatMessage } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    await requireUser();
  } catch {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }
  const body = await req.json();
  if (!body.brainId || !body.question) {
    return NextResponse.json({ error: "brainId and question required" }, { status: 400 });
  }
  const db = await loadDb();
  const brain = db.brains.find((b) => b.id === body.brainId);
  if (!brain) return NextResponse.json({ error: "Brain not found" }, { status: 404 });

  const userMsg: ChatMessage = {
    id: newId("msg"),
    brainId: body.brainId,
    role: "user",
    content: body.question,
    citations: [],
    createdAt: new Date().toISOString(),
  };
  db.messages.push(userMsg);

  const { answer, citations } = await askObi(db, body.brainId, body.question);

  const assistantMsg: ChatMessage = {
    id: newId("msg"),
    brainId: body.brainId,
    role: "assistant",
    content: answer,
    citations,
    createdAt: new Date().toISOString(),
  };
  db.messages.push(assistantMsg);

  const inboarder = body.inboarderName || "default";
  const progress =
    db.progress[inboarder] ||
    (db.progress[inboarder] = {
      inboarderName: inboarder,
      brainId: body.brainId,
      completedSopIds: [],
      askedQuestions: 0,
      blockingTopics: {},
    });
  progress.askedQuestions += 1;
  const topicKey = extractTopic(body.question);
  progress.blockingTopics[topicKey] = (progress.blockingTopics[topicKey] || 0) + 1;

  await saveDb(db);
  return NextResponse.json(assistantMsg);
}

function extractTopic(q: string): string {
  const stop = new Set([
    "comment", "pourquoi", "quoi", "quel", "quelle", "avec", "dans", "pour", "les", "des", "une", "que", "est", "sur", "the", "how",
  ]);
  const words = q
    .toLowerCase()
    .split(/\W+/)
    .filter((w) => w.length > 3 && !stop.has(w));
  return words.slice(0, 3).join(" ") || q.slice(0, 30);
}
