import type { Chunk, Db } from "./types";
import { cosine, chatComplete, deterministicEmbedding, embed } from "./mistral";
import { config } from "./config";
import { getSupabase } from "./supabase";

const COMPANION_SYSTEM = `Tu es Obi, agent d'onboarding. Tu accompanies un nouveau collaborateur qui reprend un poste.
Tu disposes d'extraits du "Brain" du prédécesseur (SOP structurées + transcriptions).
Réponds en français, de façon concise et actionnable, en guidant étape par étape quand c'est pertinent.
Cite les outils et contacts mentionnés dans le contexte. Si le contexte ne suffit pas, dis-le clairement.`;

export interface CompanionAnswer {
  answer: string;
  citations: string[];
}

export async function askObi(db: Db, brainId: string, question: string): Promise<CompanionAnswer> {
  const relevant = await retrieve(db, brainId, question);
  const context = relevant
    .map((c, i) => `[Extrait ${i + 1}] ${c.text.slice(0, 600)}`)
    .join("\n\n");

  const fallback = relevant.length
    ? `D'après le Brain du poste, voici ce que je sais sur « ${question} » :\n\n` +
      relevant
        .map((c) => (c.kind === "sop" ? c.text.replace(/^SOP: /, "") : c.text))
        .slice(0, 3)
        .map((t) => `• ${t.slice(0, 400)}`)
        .join("\n\n")
    : "Je n'ai pas encore de connaissance indexée sur ce sujet dans ce Brain. Demande au prédécesseur d'enregistrer un processus correspondant.";

  const llm = await chatComplete([
    { role: "system", content: COMPANION_SYSTEM },
    {
      role: "user",
      content: `Question du nouveau collaborateur: ${question}\n\nContexte du Brain:\n${context || "(aucun extrait pertinent)"}`,
    },
  ]);

  const citations = relevant.map((c) => (c.sopId ? `sop:${c.sopId}` : `chunk:${c.id}`)).slice(0, 5);
  return {
    answer: llm || fallback,
    citations,
  };
}

export async function retrieve(
  db: Db,
  brainId: string,
  query: string,
  topK = config.topK,
): Promise<(Chunk & { score: number })[]> {
  const sb = getSupabase();
  if (sb) {
    try {
      const [queryEmb] = await embed([query]);
      if (queryEmb) {
        const { data, error } = await sb.rpc("match_chunks", {
          query_embedding: queryEmb,
          match_brain_id: brainId,
          match_count: topK,
        });
        if (!error && data?.length) {
          return data.map((r: Record<string, unknown>) => ({
            id: r.id as string,
            brainId: r.brain_id as string,
            sopId: (r.sop_id as string) ?? undefined,
            recordingId: (r.recording_id as string) ?? undefined,
            kind: r.kind as Chunk["kind"],
            text: r.text_content as string,
            embedding: [],
            score: r.similarity as number,
          }));
        }
      }
    } catch {
      // fallback mémoire
    }
  }
  const q = deterministicEmbedding(query);
  return db.chunks
    .filter((c) => c.brainId === brainId)
    .map((c) => ({ ...c, score: cosine(q, c.embedding) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}
