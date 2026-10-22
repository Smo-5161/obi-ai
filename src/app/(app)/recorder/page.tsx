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
  structuring: "Découpage en SOP par Omi…",
  indexing: "Indexation vectorielle dans le Brain…",
  ready: "Prêt",
  failed: "Échec",
};

export default function RecorderPage() {
  const router = useRouter();

  const [brains, setBrains] = useState<Brain[]>([]);
  const [brainId, setBrainId] = useState("");
  const [newBrain, setNewBrain] = useState("");
  const [title, setTitle] = useState("");
  const [stage, setStage] = useState<string | null>(null);
  const [result, setResult] = useState<{ sops: string[]; sensitiveMasked: number } | null>(null);
  const [simScript, setSimScript] = useState("");
  const [simulating, setSimulating] = useState(false);
  const [simSeconds, setSimSeconds] = useState(0);

  useEffect(() => {
    fetch("/api/brains")
      .then((r) => (r.ok ? r.json() : []))
      .then((b: Brain[]) => {
        setBrains(b);
        if (b[0]) setBrainId(b[0].id);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!simulating) return;
    const t = setInterval(() => setSimSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [simulating]);

  async function ensureBrain(): Promise<string> {
    if (brainId) return brainId;
    if (!newBrain) throw new Error("Choisis ou crée un Brain");
    const res = await fetch("/api/brains", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newBrain, owner: "Moi", scope: "job" }),
    });
    if (!res.ok) throw new Error("Création du Brain impossible");
    const b = await res.json();
    setBrains((prev) => [...prev, b]);
    setBrainId(b.id);
    return b.id;
  }

  async function stopSimulated() {
    setSimulating(false);
    setStage("uploading");
    const targetBrain = await ensureBrain();
    const sentences = simScript.split(/\n+/).map((s) => s.trim()).filter(Boolean);
    const per = Math.max(10, Math.floor(simSeconds / Math.max(sentences.length, 1)));
    const transcript = sentences.map((text, i) => ({ start: i * per, end: (i + 1) * per, text }));
    for (const s of ["transcribing", "structuring", "indexing"] as const) setStage(s);
    const res = await fetch("/api/recordings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        brainId: targetBrain,
        title,
        durationSec: Math.max(simSeconds, 10),
        transcript: transcript.length ? transcript : [{ start: 0, end: simSeconds || 10, text: title }],
        actionLogs: [],
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

  const seconds = simSeconds;

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-text-strong">Omi Recorder</h1>
        <p className="mt-2 text-muted">
          Décrivez votre session de travail : Omi structure en SOP, masque les données
          sensibles et indexe tout dans le Brain du poste.
        </p>
      </div>

      <div className="space-y-4 border-2 border-line bg-paper-raised p-6 shadow-[4px_4px_0_0_var(--line)]">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm text-foreground">
            Brain cible
            <select
              value={brainId}
              onChange={(e) => setBrainId(e.target.value)}
              className="mt-1 w-full border-2 border-line bg-background p-2 text-text-strong"
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
                className="mt-1 w-full border-2 border-line bg-background p-2 text-text-strong"
                placeholder="Ex: Responsable Marketing"
              />
            </label>
          )}
          <label className="text-sm text-foreground md:col-span-2">
            Titre du processus enregistré
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full border-2 border-line bg-background p-2 text-text-strong"
              placeholder="Ex: Reporting mensuel sur Supabase"
            />
          </label>
        </div>

        {!simulating && (
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => {
                if (!title) return;
                setSimulating(true);
                setSimSeconds(0);
                setResult(null);
              }}
              disabled={!title}
              className="border-2 border-line bg-background px-5 py-2 font-bold text-text-strong shadow-[3px_3px_0_0_var(--line)] disabled:opacity-40"
            >
              ● Mode simulation (texte)
            </button>
          </div>
        )}

        {simulating && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="font-mono text-2xl text-accent">{format(seconds)}</span>
              {false && (
                <span className="text-xs text-muted">
                </span>
              )}
            </div>
            {simulating && (
              <label className="block text-sm text-foreground">
                Contexte de travail (ce que vous faisiez)
                <textarea
                  value={simScript}
                  onChange={(e) => setSimScript(e.target.value)}
                  rows={4}
                  className="mt-1 w-full border-2 border-line bg-background p-2 text-text-strong"
                  placeholder="Je commence par ouvrir Supabase…"
                />
              </label>
            )}
            <button
              onClick={stopSimulated}
              className="border-2 border-ink bg-paper-raised px-5 py-2 font-bold text-text-strong shadow-[3px_3px_0_0_var(--ink)]"
            >
              ■ Stop &amp; analyser
            </button>
          </div>
        )}

        {stage && (
          <div className="border-2 border-line bg-background p-4 text-sm text-foreground shadow-[3px_3px_0_0_var(--line)]">
            {stageLabels[stage] ?? stage}
          </div>
        )}

        {result && (
          <div className="border-2 border-accent bg-accent-soft p-4 text-sm text-text-strong shadow-[3px_3px_0_0_var(--accent)]">
            <p>
              {result.sops.length} SOP générée(s) et indexée(s). {result.sensitiveMasked} donnée(s)
              sensible(s) masquée(s).
            </p>
            <button
              onClick={() => router.push(`/brains/${brainId}`)}
              className="mt-2 border-2 border-ink bg-ink px-3 py-1.5 font-bold text-paper"
            >
              Voir dans le Brain
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
