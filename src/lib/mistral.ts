import { Mistral } from "@mistralai/mistralai";
import { config } from "./config";

let client: Mistral | null = null;

function getClient(): Mistral | null {
  if (!config.mistralApiKey) return null;
  if (!client) client = new Mistral({ apiKey: config.mistralApiKey });
  return client;
}

export async function embed(texts: string[], dim = 1024): Promise<number[][]> {
  const c = getClient();
  if (!c) return texts.map((t) => deterministicEmbedding(t, dim));
  const res = await c.embeddings.create({
    model: "mistral-embed",
    inputs: texts,
  });
  return res.data.map((d) => d.embedding as number[]);
}

export function deterministicEmbedding(text: string, dim = 1024): number[] {
  const v = new Array(dim).fill(0);
  const tokens = text.toLowerCase().split(/\W+/).filter(Boolean);
  for (const t of tokens) {
    let h = 0;
    for (let i = 0; i < t.length; i++) h = (h * 31 + t.charCodeAt(i)) >>> 0;
    v[h % dim] += (h % 17) / 17;
  }
  const norm = Math.sqrt(v.reduce((s, x) => s + x * x, 0)) || 1;
  return v.map((x) => x / norm);
}

export async function chatComplete(
  messages: { role: "system" | "user" | "assistant"; content: string }[],
): Promise<string | null> {
  const c = getClient();
  if (!c) return null;
  try {
    const res = await c.chat.complete({
      model: config.mistralModel,
      messages,
      temperature: 0.2,
    });
    const content = res.choices?.[0]?.message?.content;
    return typeof content === "string" ? content : null;
  } catch {
    return null;
  }
}

export function cosine(a: number[], b: number[]): number {
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb) || 1);
}
