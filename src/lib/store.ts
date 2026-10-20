import { promises as fs } from "fs";
import path from "path";
import type { Db } from "./types";

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

export async function loadDb(): Promise<Db> {
  if (cache) return cache;
  try {
    const raw = await fs.readFile(DB_FILE, "utf-8");
    cache = JSON.parse(raw) as Db;
  } catch {
    cache = emptyDb();
  }
  return cache;
}

export async function saveDb(db: Db): Promise<void> {
  cache = db;
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
}

export function newId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}
