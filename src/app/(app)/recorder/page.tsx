"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Brain {
  id: string;
  name: string;
}

const stageLabels: Record<string, string> = {
  uploading: "Envoi du flux…",
  transcribing: "Transcription speech-to-text…",
  structuring: "Découpage en SOP par Obi…",
  indexing: "Indexation vectorielle dans le Brain…",
  ready: "Prêt ✅",
  failed: "Échec",
};

export default function RecorderPage() {
  const router = useRouter();
  const [brains, setBrains] = useState<Brain[]>([]);
  const [brainId, setBrainId] = useState("");
  const [newBrain, setNewBrain] = useState("");
  const [title, setTitle] = useState("");
  const [script, setScript] = useState("");
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [stage, setStage] = useState<string | null>(null);
  const [result, setResult] = useState<{ sops: string[]; sensitiveMasked: number } | null>(null);

  useEffect(() => {
    fetch("/api/brains")
      .then((r) => r.json())
      .then((b: Brain[]) => {
        setBrains(b);
        if (b[0]) setBrainId(b[0].id);
      });
  }, []);

  useEffect(() => {
    if (!recording) return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [recording]);

  async function ensureBrain(): Promise<string> {
    if (brainId) return brainId;
    if (!newBrain) throw new Error("Choisis ou crée un Brain");
    const res = await fetch("/api/brains", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newBrain, owner: "Moi", scope: "job" }),
    });
    const b = await res.json();
    setBrains((prev) => [...prev, b]);
    setBrainId(b.id);
    return b.id;
  }

  async function stop() {
    setRecording(false);
    setStage("uploading");
    const targetBrain = await ensureBrain();
    const sentences = script
      .split(/\n+/)
      .map((s) => s.trim())
      .filter(Boolean);
    const per = Math.max(10, Math.floor(seconds / Math.max(sentences.length, 1)));
    const transcript = sentences.map((text, i) => ({
      start: i * per,
      end: (i + 1) * per,
      text,
    }));
    const actionLogs = sentences.map((text, i) => ({
      timestamp: i * per + 2,
      type: "click" as const,
      app: (text.match(/(?:sur|dans|avec|ouvre)\s+([A-Z][\w-]+)/)?.[1] as string) || "Navigateur",
      target: text.slice(0, 60),
    }));
    for (const s of ["transcribing", "structuring", "indexing"] as const) {
      setStage(s);
      await new Promise((r) => setTimeout(r, 700));
    }
    const res = await fetch("/api/recordings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        brainId: targetBrain,
        title,
        durationSec: Math.max(seconds, 10),
        transcript: transcript.length ? transcript : [{ start: 0, end: seconds || 10, text: title }],
        actionLogs,
      }),
    });
    if (res.ok) {
      const rec = await res.json();
      setResult({ sops: rec.sops, sensitiveMasked: rec.sensitiveMasked });
      setStage("ready");
    } else {
      setStage("failed");
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-text-strong">Obi Recorder</h1>
        <p className="mt-2 text-muted">
          Enregistre ton écran et commente : Obi transcrit, découpe en SOP, masque les données
          sensibles et indexe tout dans le Brain du poste.
        </p>
      </div>

      <div className="rounded-none border border-line bg-paper-raised p-6 space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm text-foreground">
            Brain cible
            <select
              value={brainId}
              onChange={(e) => setBrainId(e.target.value)}
              className="mt-1 w-full rounded-none bg-background p-2 text-text-strong"
            >
              <option value="">— Nouveau Brain —</option>
              {brains.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </label>
          {!brainId && (
            <label className="text-sm text-foreground">
              Nom du nouveau Brain
              <input
                value={newBrain}
                onChange={(e) => setNewBrain(e.target.value)}
                className="mt-1 w-full rounded-none bg-background p-2 text-text-strong"
                placeholder="Ex: Responsable Marketing"
              />
            </label>
          )}
          <label className="text-sm text-foreground md:col-span-2">
            Titre du processus enregistré
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full rounded-none bg-background p-2 text-text-strong"
              placeholder="Ex: Reporting mensuel sur Supabase"
            />
          </label>
        </div>

        <label className="block text-sm text-foreground">
          Commentaire vocal (transcrit — simule le flux STT)
          <textarea
            value={script}
            onChange={(e) => setScript(e.target.value)}
            rows={4}
            className="mt-1 w-full rounded-none bg-background p-2 text-text-strong"
            placeholder="Je commence par ouvrir Supabase…"
          />
        </label>

        <div className="flex items-center gap-4">
          {!recording ? (
            <button
              onClick={() => { setRecording(true); setSeconds(0); setStage(null); setResult(null); }}
              disabled={!title}
              className="rounded-none bg-accent px-5 py-2 font-medium text-white disabled:opacity-40"
            >
              ● Démarrer l&apos;enregistrement
            </button>
          ) : (
            <>
              <span className="font-mono text-2xl text-red-400">{format(seconds)}</span>
              <button onClick={stop} className="rounded-none border-2 border-ink bg-paper-raised px-5 py-2 font-bold text-text-strong shadow-[3px_3px_0_0_var(--ink)]">
                ■ Stop &amp; analyser
              </button>
            </>
          )}
        </div>

        {stage && (
          <div className="rounded-none border-2 border-line bg-paper-raised p-4 text-sm text-foreground shadow-[3px_3px_0_0_var(--line)]">
            {stageLabels[stage]}
          </div>
        )}

        {result && (
          <div className="rounded-none border border-accent bg-accent-soft p-4 text-sm text-text-strong">
            <p>{result.sops.length} SOP générée(s) et indexée(s). {result.sensitiveMasked} donnée(s) sensible(s) masquée(s).</p>
            <button
              onClick={() => router.push(`/brains/${brainId}`)}
              className="mt-2 rounded bg-emerald-700 px-3 py-1.5 text-white"
            >
              Voir dans le Brain →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function format(s: number): string {
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}
