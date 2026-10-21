import { embed, deterministicEmbedding, cosine } from "./mistral";
import { newId } from "./store";
import type { Db, Insight, TranscriptSegment, ActionLog } from "./types";

const EXTRACT_SYSTEM = `Tu es Omi. Tu analyses l'activité enregistrée d'un collaborateur (transcription de ses commentaires + logs d'actions).
En plus des process (SOP), extrais la CONNAISSANCE DE CONTEXTE du poste :
- "project" : un projet en cours mentionné ou détecté (nom, état, prochaine étape)
- "difficulty" : une difficulté, un blocage, un irritant actuel
- "attention" : un point d'attention, une vigilance (deadline, risque, dépendance)
- "preference" : une préférence de travail, une habitude utile au successeur
- "context" : toute autre information de contexte utile (interlocuteurs, outils, organisation)

Réponds UNIQUEMENT en JSON valide :
{"insights":[{"kind":"project|difficulty|attention|preference|context","title":"court (max 8 mots)","detail":"1-3 phrases précises"}]}
Si l'activité ne révèle rien de tel, renvoie {"insights":[]}. Pas de markdown.`;

export interface ExtractedInsight {
  kind: Insight["kind"];
  title: string;
  detail: string;
}

export async function extractInsights(
  transcript: TranscriptSegment[],
  logs: ActionLog[],
): Promise<ExtractedInsight[]> {
  const { chatComplete } = await import("./mistral");
  const prompt = `Commentaires du collaborateur :
${transcript.map((t) => `- ${t.text}`).join("\n")}

Actions détectées :
${logs.slice(0, 60).map((l) => `- ${l.type}${l.app ? ` (${l.app})` : ""}${l.target ? ` sur "${l.target}"` : ""}${l.url ? ` ${l.url}` : ""}`).join("\n")}`;
  const raw = await chatComplete([
    { role: "system", content: EXTRACT_SYSTEM },
    { role: "user", content: prompt },
  ]);
  if (!raw) {
    return heuristicInsights(transcript);
  }
  try {
    const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
    if (Array.isArray(parsed.insights)) {
      return parsed.insights
        .filter((i: ExtractedInsight) => i && i.title && Object.values(KINDS).includes(i.kind))
        .map((i: ExtractedInsight) => ({ kind: i.kind, title: String(i.title).slice(0, 120), detail: String(i.detail ?? "").slice(0, 600) }));
    }
  } catch {}
  return [];
}

const KINDS = ["project", "difficulty", "attention", "preference", "context"] as const;

function heuristicInsights(transcript: TranscriptSegment[]): ExtractedInsight[] {
  const out: ExtractedInsight[] = [];
  const joined = transcript.map((t) => t.text).join(" ").toLowerCase();
  if (/projet|campaign|chantier|refonte|migration/.test(joined)) {
    out.push({ kind: "project", title: "Projet en cours", detail: "Un projet est mentionné dans l'activité enregistrée." });
  }
  if (/difficile|bloqué|problème|bug|erreur|retard/.test(joined)) {
    out.push({ kind: "difficulty", title: "Difficulté signalée", detail: "Une difficulté ou un blocage est mentionné." });
  }
  if (/attention|attention|deadline|urgent|risque|prévoir/.test(joined)) {
    out.push({ kind: "attention", title: "Point d'attention", detail: "Un point de vigilance est mentionné." });
  }
  return out;
}

/**
 * Déduplication : compare chaque nouvel insight aux insights existants du Brain.
 * Similarité > SIMILARITY_THRESHOLD -> mise à jour de l'insight existant (enrichi),
 * sinon création. Retourne les insights à créer et à mettre à jour.
 */
export async function dedupeInsights(
  db: Db,
  brainId: string,
  incoming: ExtractedInsight[],
): Promise<{ toCreate: ExtractedInsight[]; toUpdate: { existing: Insight; incoming: ExtractedInsight }[] }> {
  const existing = db.insights.filter((i) => i.brainId === brainId);
  const toCreate: ExtractedInsight[] = [];
  const toUpdate: { existing: Insight; incoming: ExtractedInsight }[] = [];

  if (!existing.length) {
    return { toCreate: incoming, toUpdate };
  }

  // embeddings : on embedde l'existant une seule fois par appel
  let existingEmbeddings: number[][] | null = null;
  try {
    const emb = await embed([...existing.map((e) => `${e.kind} ${e.title} ${e.detail}`), ...incoming.map((i) => `${i.kind} ${i.title} ${i.detail}`)]);
    existingEmbeddings = emb.slice(0, existing.length);
    const incomingEmb = emb.slice(existing.length);
    const THRESHOLD = 0.82;
    incoming.forEach((inc, idx) => {
      let best = -1;
      let bestScore = 0;
      existing.forEach((exp, eidx) => {
        if (exp.kind !== inc.kind) return; // déduplication par type
        const score = cosine(existingEmbeddings![eidx], incomingEmb[idx]);
        if (score > bestScore) {
          bestScore = score;
          best = eidx;
        }
      });
      if (best >= 0 && bestScore > THRESHOLD) {
        toUpdate.push({ existing: existing[best], incoming: inc });
      } else {
        toCreate.push(inc);
      }
    });
    return { toCreate, toUpdate };
  } catch {
    // fallback déterministe : comparaison mots-clés
    incoming.forEach((inc) => {
      const incTokens = new Set(`${inc.title} ${inc.detail}`.toLowerCase().split(/\W+/).filter((w) => w.length > 3));
      let best = -1;
      let bestOverlap = 0;
      existing.forEach((exp, eidx) => {
        if (exp.kind !== inc.kind) return;
        const expTokens = new Set(`${exp.title} ${exp.detail}`.toLowerCase().split(/\W+/).filter((w) => w.length > 3));
        let inter = 0;
        for (const t of incTokens) if (expTokens.has(t)) inter++;
        const overlap = inter / Math.sqrt(incTokens.size * expTokens.size || 1);
        if (overlap > bestOverlap) {
          bestOverlap = overlap;
          best = eidx;
        }
      });
      if (best >= 0 && bestOverlap > 0.55) {
        toUpdate.push({ existing: existing[best], incoming: inc });
      } else {
        toCreate.push(inc);
      }
    });
    return { toCreate, toUpdate };
  }
}

export function buildInsight(brainId: string, inc: ExtractedInsight): Insight {
  return {
    id: newId("ins"),
    brainId,
    kind: inc.kind,
    title: inc.title,
    detail: inc.detail,
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };
}

void deterministicEmbedding;
