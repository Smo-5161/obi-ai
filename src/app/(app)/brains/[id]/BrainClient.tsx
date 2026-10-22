"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Sop {
  id: string;
  title: string;
  frequency: string;
  steps: { id: string; order: number; title: string; instruction: string; tool?: string }[];
  tools: string[];
  contacts: string[];
}

interface Insight {
  id: string;
  kind: string;
  title: string;
  detail: string;
  updatedAt: string;
}

interface BrainDetail {
  brain: { id: string; name: string; owner: string; description: string; referenceDuties: string[] };
  sops: Sop[];
  recordings: { id: string; title: string; durationSec: number; sensitiveMasked: number }[];
  insights: Insight[];
  graph: { type: string; name: string; linkedSops: string[] }[];
  coverage: number;
}

export default function BrainClient() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<BrainDetail | null>(null);
  const [inboarder] = useState("Nouveau collaborateur");
  const [editing, setEditing] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newSteps, setNewSteps] = useState("");

  useEffect(() => {
    fetch(`/api/brains/${id}`).then((r) => r.json()).then(setData);
  }, [id]);

  async function deleteInsight(insightId: string) {
    if (!data || !confirm("Supprimer cette connaissance ?")) return;
    await fetch(`/api/insights?id=${insightId}`, { method: "DELETE" });
    const refreshed = await fetch(`/api/brains/${data.brain.id}`).then((r) => r.json());
    setData(refreshed);
  }

  async function addSop() {
    if (!newTitle.trim() || !data) return;
    const steps = newSteps.split("\n").filter((l) => l.trim()).map((l) => ({ title: l.trim() }));
    await fetch("/api/sops", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ brainId: data.brain.id, title: newTitle.trim(), steps }),
    });
    setNewTitle("");
    setNewSteps("");
    const refreshed = await fetch(`/api/brains/${data.brain.id}`).then((r) => r.json());
    setData(refreshed);
  }

  async function deleteSop(sopId: string) {
    if (!data || !confirm("Supprimer cette SOP ?")) return;
    await fetch(`/api/sops?id=${sopId}`, { method: "DELETE" });
    const refreshed = await fetch(`/api/brains/${data.brain.id}`).then((r) => r.json());
    setData(refreshed);
  }

  async function renameSop(sopId: string) {
    if (!data || !editing) return;
    await fetch("/api/sops", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: sopId, title: newTitle.trim() || undefined }),
    });
    setEditing(null);
    const refreshed = await fetch(`/api/brains/${data.brain.id}`).then((r) => r.json());
    setData(refreshed);
  }

  async function complete(sopId: string) {
    await fetch("/api/recordings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sopId, inboarderName: inboarder }),
    });
  }

  if (!data) return <p className="text-muted">Chargement du Brain…</p>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-text-strong">{data.brain.name}</h1>
        <p className="mt-1 text-muted">{data.brain.description || data.brain.owner}</p>
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          <span className="rounded-none bg-accent-soft px-3 py-1 text-accent-bright">
            Couverture : {data.coverage}%
          </span>
          <span className="rounded-none bg-background px-3 py-1 text-foreground">
            {data.sops.length} SOP · {data.recordings.length} enregistrement(s)
          </span>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-text-strong">SOP indexées</h2>
          {data.sops.map((s) => (
            <details key={s.id} className="rounded-none border border-line bg-paper-raised p-4">
              <summary className="cursor-pointer font-medium text-text-strong">
                {editing === s.id ? (
                  <span className="flex flex-wrap items-center gap-2">
                    <input
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      onClick={(e) => e.preventDefault()}
                      className="w-56 border-2 border-line bg-background p-1 text-sm"
                    />
                    <button
                      onClick={(e) => { e.preventDefault(); renameSop(s.id); }}
                      className="border-2 border-ink bg-accent px-2 py-0.5 text-xs text-background"
                    >
                      Enregistrer
                    </button>
                    <button
                      onClick={(e) => { e.preventDefault(); setEditing(null); }}
                      className="border-2 border-line bg-background px-2 py-0.5 text-xs text-muted"
                    >
                      Annuler
                    </button>
                  </span>
                ) : (
                  s.title
                )}
                <span className="ml-2 text-xs text-muted">{s.frequency}</span>
              </summary>
              <ol className="mt-3 space-y-2 text-sm text-foreground">
                {s.steps.map((st) => (
                  <li key={st.id} className="rounded bg-background p-2">
                    <span className="text-accent">{st.order}.</span> <strong>{st.title}</strong>
                    <p className="text-muted">{st.instruction}</p>
                    {st.tool && <p className="mt-1 text-xs text-muted">Outil : {st.tool}</p>}
                  </li>
                ))}
              </ol>
              <div className="mt-3 flex items-center justify-between">
                <div className="text-xs text-muted">
                  Outils : {s.tools.join(", ") || "—"} · Contacts : {s.contacts.join(", ") || "—"}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => complete(s.id)}
                    className="rounded-none border-2 border-ink bg-accent px-2 py-1 text-xs text-background hover:bg-accent-bright"
                  >
                    ✓ Maîtrisée
                  </button>
                  <button
                    onClick={() => { setEditing(s.id); setNewTitle(s.title); }}
                    className="rounded-none border-2 border-line bg-background px-2 py-1 text-xs text-text-strong hover:border-accent"
                  >
                    ✎ Modifier
                  </button>
                  <button
                    onClick={() => deleteSop(s.id)}
                    className="rounded-none border-2 border-line bg-background px-2 py-1 text-xs text-muted hover:border-accent hover:text-accent"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </details>
          ))}

          <div className="mt-6 border-2 border-line bg-background p-4 shadow-[3px_3px_0_0_var(--line)]">
            <h3 className="text-sm font-bold text-text-strong">Ajouter une SOP manuellement</h3>
            <div className="mt-3 space-y-2">
              <input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Titre du processus (ex: Préparer la newsletter)"
                className="w-full border-2 border-line bg-paper-raised p-2 text-sm text-text-strong"
              />
              <textarea
                value={newSteps}
                onChange={(e) => setNewSteps(e.target.value)}
                placeholder={"Une étape par ligne…"}
                rows={3}
                className="w-full border-2 border-line bg-paper-raised p-2 text-sm text-text-strong"
              />
              <button
                onClick={addSop}
                disabled={!newTitle.trim()}
                className="border-2 border-ink bg-accent px-4 py-1.5 text-sm font-bold text-background disabled:opacity-40"
              >
                + Ajouter la SOP
              </button>
            </div>
          </div>

          {data.insights?.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-text-strong">Connaissances du poste</h2>
            <p className="mt-1 text-xs text-muted">
              Projets, difficultés et points d'attention mémorisés automatiquement par Omi.
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {data.insights.map((ins) => (
                <div
                  key={ins.id}
                  className="border-2 border-line bg-background p-3 shadow-[3px_3px_0_0_var(--line)]"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wide text-accent">
                        {insightLabel(ins.kind)}
                      </span>
                      <h4 className="mt-0.5 text-sm font-bold text-text-strong">{ins.title}</h4>
                    </div>
                    <button
                      onClick={() => deleteInsight(ins.id)}
                      className="shrink-0 border-2 border-line bg-paper-raised px-1.5 py-0.5 text-xs text-muted hover:border-accent hover:text-accent"
                      aria-label="Supprimer"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-foreground">{ins.detail}</p>
                  <p className="mt-2 text-[10px] text-muted">
                    mis à jour le {new Date(ins.updatedAt).toLocaleDateString("fr-FR")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <h2 className="pt-4 text-xl font-semibold text-text-strong">Graphe de dépendances</h2>
          <div className="flex flex-wrap gap-2">
            {data.graph.map((n) => (
              <span
                key={`${n.type}:${n.name}`}
                className={`rounded-none px-3 py-1 text-sm ${
                  n.type === "tool" ? "bg-amber-950 text-amber-300" : "bg-teal-950 text-teal-300"
                }`}
              >
                {n.type === "tool" ? "🛠" : "👤"} {n.name}
                <span className="ml-1 text-xs opacity-60">({n.linkedSops.length})</span>
              </span>
            ))}
            {!data.graph.length && <p className="text-sm text-muted">Aucune dépendance cartographiée.</p>}
          </div>
        </section>

      </div>
    </div>
  );
}

function insightLabel(kind: string): string {
  switch (kind) {
    case "project": return "Projet en cours";
    case "difficulty": return "Difficulté";
    case "attention": return "Point d'attention";
    case "preference": return "Préférence";
    default: return "Contexte";
  }
}
