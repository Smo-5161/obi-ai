import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient, requireUser } from "@/lib/auth";
import { embed, deterministicEmbedding } from "@/lib/mistral";
import { loadDb, newId } from "@/lib/store";

const knowledgeSchema = z.object({
  title: z.string().trim().min(1).max(180),
  text: z.string().trim().min(1).max(20_000),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireUser();
  } catch {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }
  const { id: brainId } = await params;
  const parsed = knowledgeSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Titre ou contenu invalide" }, { status: 400 });

  const db = await loadDb();
  if (!db.brains.some((brain) => brain.id === brainId)) {
    return NextResponse.json({ error: "Brain not found" }, { status: 404 });
  }
  const text = parsed.data.title + "\n\n" + parsed.data.text;
  let vector: number[];
  try {
    vector = (await embed([text]))[0];
  } catch {
    vector = deterministicEmbedding(text);
  }
  const id = newId("chunk");
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("chunks").insert({
    id,
    brain_id: brainId,
    sop_id: null,
    recording_id: null,
    kind: "document",
    text,
    embedding: "[" + vector.join(",") + "]",
  } as never);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ id, brainId, kind: "document", text, createdAt: new Date().toISOString() }, { status: 201 });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireUser();
  } catch {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }
  const { id: brainId } = await params;
  const chunkId = req.nextUrl.searchParams.get("chunkId");
  if (!chunkId) return NextResponse.json({ error: "chunkId requis" }, { status: 400 });
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("chunks").delete().eq("brain_id", brainId).eq("id", chunkId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
