import { promises as fs } from "fs";
import path from "path";
import type { ChatMessage, Chunk, Db, OnboardingProgress, Recording, Sop } from "./types";
import { getSupabase, isSupabaseEnabled } from "./supabase";

const DATA_DIR = path.join(process.cwd(), ".obi-data");
const DB_FILE = path.join(DATA_DIR, "db.json");

const emptyDb = (): Db => ({
  brains: [],
  recordings: {},
  sops: {},
  chunks: [],
  messages: [],
  progress: {},
});

let cache: Db | null = null;

const snake = (s: string) => s.replace(/[A-Z]/g, (c) => "_" + c.toLowerCase());
const camel = (s: string) => s.replace(/_([a-z])/g, (_, c) => c.toUpperCase());

function rowToObj<T extends object>(row: Record<string, unknown>): T {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(row)) out[camel(k)] = v;
  return out as T;
}

async function loadFromSupabase(): Promise<Db | null> {
  const sb = getSupabase();
  if (!sb) return null;
  const db = emptyDb();
  const [brains, recordings, sops, chunks, messages, progress] = await Promise.all([
    sb.from("brains").select("*"),
    sb.from("recordings").select("*"),
    sb.from("sops").select("*"),
    sb.from("chunks").select("id,brain_id,sop_id,recording_id,kind,text"),
    sb.from("messages").select("*").order("created_at", { ascending: true }).limit(200),
    sb.from("progress").select("*"),
  ]);
  if (brains.error) throw new Error("Supabase brains: " + brains.error.message);
  if (recordings.error) throw new Error("Supabase recordings: " + recordings.error.message);
  if (sops.error) throw new Error("Supabase sops: " + sops.error.message);
  if (messages.error) throw new Error("Supabase messages: " + messages.error.message);
  if (progress.error) throw new Error("Supabase progress: " + progress.error.message);
  if (chunks.error) throw new Error("Supabase chunks: " + chunks.error.message);

  db.chunks = (chunks.data || []).map((r) => ({
    ...(rowToObj<Chunk>(r)),
    embedding: [],
  }));
  db.brains = (brains.data || []).map((r) => rowToObj(r));
  for (const r of recordings.data || []) {
    const rec = rowToObj<Recording>(r);
    db.recordings[rec.id] = rec;
  }
  for (const r of sops.data || []) {
    const sop = rowToObj<Sop>(r);
    db.sops[sop.id] = sop;
  }
  db.messages = (messages.data || []).map((r) => rowToObj<ChatMessage>(r));
  for (const r of progress.data || []) {
    const p = rowToObj<OnboardingProgress>(r);
    db.progress[p.inboarderName] = p;
  }
  return db;
}

export async function loadDb(): Promise<Db> {
  if (cache) return cache;
  if (isSupabaseEnabled()) {
    try {
      const db = await loadFromSupabase();
      if (db) {
        cache = db;
        return db;
      }
    } catch {
      // fallback silencieux vers le store local
    }
  }
  try {
    const raw = await fs.readFile(DB_FILE, "utf-8");
    cache = JSON.parse(raw) as Db;
  } catch {
    cache = emptyDb();
  }
  return cache;
}

async function saveToSupabase(db: Db): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;
  const upsert = async (table: string, rows: object[]) => {
    if (!rows.length) return;
    const mapped = rows.map((r) => {
      const out: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(r)) out[snake(k)] = v;
      return out;
    });
    const { error } = await sb.from(table).upsert(mapped);
    if (error) throw new Error(`Supabase upsert ${table}: ${error.message}`);
  };
  await upsert("brains", db.brains);
  await upsert("recordings", Object.values(db.recordings));
  await upsert("sops", Object.values(db.sops));
  await upsert("messages", db.messages.slice(-200));
  await upsert("progress", Object.values(db.progress));
  if (db.chunks.length) {
    const rows = db.chunks.map((c) => ({
      id: c.id,
      brain_id: c.brainId,
      sop_id: c.sopId ?? null,
      recording_id: c.recordingId ?? null,
      kind: c.kind,
      text: c.text,
      embedding: `[${c.embedding.join(",")}]`,
    }));
    const { error } = await sb.from("chunks").upsert(rows);
    if (error) throw new Error(`Supabase upsert chunks: ${error.message}`);
  }
  return true;
}

export async function saveDb(db: Db): Promise<void> {
  cache = db;
  if (isSupabaseEnabled()) {
    const saved = await saveToSupabase(db).catch(() => false);
    if (saved) return;
  }
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
}

export function newId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}
