import { newId } from "./store";
import { redactPII, maskActionLogs } from "./redact";
import { deterministicEmbedding, embed } from "./mistral";
import type { ActionLog, Brain, Recording, Sop, SopStep, TranscriptSegment, Db } from "./types";
import { saveDb } from "./store";

export interface PipelineInput {
  title: string;
  durationSec: number;
  transcript: TranscriptSegment[];
  actionLogs: ActionLog[];
}

const SOP_SYSTEM = `Tu es Obi, expert en documentation de processus métiers.
Tu reçois la transcription commentée d'un enregistrement d'écran et les logs d'actions d'un collaborateur.
Réponds UNIQUEMENT en JSON valide, sans markdown, au format:
{"sops":[{"title":"...","frequency":"daily|weekly|monthly|adhoc","steps":[{"title":"...","instruction":"...","tool":"..."}],"tools":["..."],"contacts":["..."]}]}
Découpe en 1 à 3 SOP si l'enregistrement couvre plusieurs tâches. Reste factuel et précis.`;

export async function runIngestionPipeline(
  db: Db,
  brainId: string,
  input: PipelineInput,
  onStage?: (stage: Recording["status"]) => void,
): Promise<Recording> {
  const recordingId = newId("rec");
  const stage = (s: Recording["status"]) => onStage?.(s);

  stage("transcribing");
  const transcript = input.transcript.map((seg) => ({
    ...seg,
    text: redactPII(seg.text).text,
  }));
  const logs = maskActionLogs(input.actionLogs);

  stage("structuring");
  const sops = await structureSops(input.title, transcript, logs);

  stage("indexing");
  const recording: Recording = {
    id: recordingId,
    brainId,
    title: input.title,
    status: "ready",
    createdAt: new Date().toISOString(),
    durationSec: input.durationSec,
    actionLogs: logs,
    transcript,
    sops: [],
    sensitiveMasked: 0,
  };
  recording.sensitiveMasked = redactPII(input.transcript.map((s) => s.text).join(" ")).maskedCount;

  const createdSops: Sop[] = [];
  for (const s of sops) {
    const sop: Sop = {
      id: newId("sop"),
      brainId,
      recordingId,
      title: s.title,
      frequency: s.frequency,
      steps: s.steps.map((st: Omit<SopStep, "id" | "order">, i: number) => ({
        ...st,
        id: newId("step"),
        order: i + 1,
      })),
      tools: s.tools,
      contacts: s.contacts,
      sourceExcerpt: transcript[0]?.text?.slice(0, 200),
      createdAt: new Date().toISOString(),
    };
    createdSops.push(sop);
    db.sops[sop.id] = sop;
    recording.sops.push(sop.id);
  }

  const chunkTexts: { text: string; sopId?: string }[] = [
    ...createdSops.map((s) => ({
      text: `SOP: ${s.title} (${s.frequency}). Étapes: ${s.steps.map((st, i) => `${i + 1}. ${st.title} — ${st.instruction}`).join(" ")} Outils: ${s.tools.join(", ")}`,
      sopId: s.id,
    })),
    ...transcript.map((seg) => ({ text: seg.text })),
  ];
  const embeddings = await embedAll(chunkTexts.map((c) => c.text));
  chunkTexts.forEach((c, i) => {
    db.chunks.push({
      id: newId("chunk"),
      brainId,
      sopId: c.sopId,
      recordingId,
      kind: c.sopId ? "sop" : "transcript",
      text: c.text,
      embedding: embeddings[i],
    });
  });

  db.recordings[recordingId] = recording;
  await saveDb(db);
  return recording;
}

async function embedAll(texts: string[]): Promise<number[][]> {
  try {
    return await embed(texts);
  } catch {
    return texts.map((t) => deterministicEmbedding(t));
  }
}

async function structureSops(
  title: string,
  transcript: TranscriptSegment[],
  logs: ActionLog[],
): Promise<ParsedSop[]> {
  const { chatComplete } = await import("./mistral");
  const prompt = `Titre de l'enregistrement: ${title}
Transcription (avec timestamps):
${transcript.map((s) => `[${s.start}s] ${s.text}`).join("\n")}
Logs d'actions:
${logs.map((l) => `${l.type}${l.app ? ` (${l.app})` : ""}${l.url ? ` ${l.url}` : ""}${l.target ? ` sur "${l.target}"` : ""}`).join("\n")}`;
  const raw = await chatComplete([
    { role: "system", content: SOP_SYSTEM },
    { role: "user", content: prompt },
  ]);
  if (raw) {
    try {
      const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
      if (Array.isArray(parsed.sops) && parsed.sops.length) return parsed.sops;
    } catch {}
  }
  return heuristicSops(title, transcript, logs);
}

interface ParsedSop {
  title: string;
  frequency: "daily" | "weekly" | "monthly" | "adhoc";
  steps: { title: string; instruction: string; tool?: string }[];
  tools: string[];
  contacts: string[];
}

function heuristicSops(title: string, transcript: TranscriptSegment[], logs: ActionLog[]): ParsedSop[] {
  const apps = [...new Set(logs.map((l) => l.app).filter(Boolean))] as string[];
  const sentenceBreaks = [". ", "! ", "? "];
  const steps = transcript.map((seg, i) => {
    const first = seg.text.split(new RegExp(sentenceBreaks.map(escapeRe).join("|")))[0].trim();
    return {
      title: first.slice(0, 80) || `Étape ${i + 1}`,
      instruction: seg.text.trim(),
      tool: logs.find((l) => l.timestamp <= seg.end)?.app,
      timestamps: { start: seg.start, end: seg.end },
    };
  });
  const freq = detectFrequency(`${title} ${transcript.map((s) => s.text).join(" ")}`);
  return [
    {
      title,
      frequency: freq,
      steps,
      tools: apps,
      contacts: [],
    },
  ];
}

function detectFrequency(text: string): ParsedSop["frequency"] {
  const t = text.toLowerCase();
  if (/chaque (jour|matin|soir)|daily|quotidien/.test(t)) return "daily";
  if (/hebdo|chaque semaine|weekly/.test(t)) return "weekly";
  if (/mensuel|chaque mois|monthly/.test(t)) return "monthly";
  return "adhoc";
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function buildDependencyGraph(db: Db, brainId: string) {
  const sops = Object.values(db.sops).filter((s) => s.brainId === brainId);
  const map = new Map<string, { type: "tool" | "contact"; name: string; role?: string; linkedSops: string[] }>();
  for (const s of sops) {
    for (const t of s.tools) {
      const key = `tool:${t}`;
      const e = map.get(key) || { type: "tool" as const, name: t, linkedSops: [] };
      e.linkedSops.push(s.id);
      map.set(key, e);
    }
    for (const c of s.contacts) {
      const key = `contact:${c}`;
      const e = map.get(key) || { type: "contact" as const, name: c, role: "contact clé", linkedSops: [] };
      e.linkedSops.push(s.id);
      map.set(key, e);
    }
  }
  return [...map.values()];
}

export function brainCoverage(db: Db, brain: Brain): number {
  const sops = Object.values(db.sops).filter((s) => s.brainId === brain.id);
  if (!brain.referenceDuties.length) return sops.length > 0 ? 100 : 0;
  const covered = brain.referenceDuties.filter((duty) =>
    sops.some((s) => similarity(duty, s.title) > 0.3),
  ).length;
  return Math.round((covered / brain.referenceDuties.length) * 100);
}

function similarity(a: string, b: string): number {
  const ta = new Set(a.toLowerCase().split(/\W+/).filter((w) => w.length > 2));
  const tb = new Set(b.toLowerCase().split(/\W+/).filter((w) => w.length > 2));
  let inter = 0;
  for (const w of ta) if (tb.has(w)) inter++;
  return inter / Math.sqrt(ta.size * tb.size || 1);
}
