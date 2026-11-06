"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import BrainVisualization, { type BrainVisualItem } from "@/components/BrainVisualization";

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
  recordings: { id: string; title: string; durationSec: number; sensitiveMasked: number; transcript?: { start: number; end: number; text: string }[] }[];
  chunks: { id: string; kind: string; text: string; createdAt?: string }[];
  insights: Insight[];
  graph: { type: string; name: string; linkedSops: string[] }[];
  coverage: number;
}

export default function BrainClient() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<BrainDetail | null>(null);
  const [activePanel, setActivePanel] = useState<"map" | "sessions" | "knowledge" | "procedures">("map");
  const [inboarder] = useState("Nouveau collaborateur");
  const [editing, setEditing] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newSteps, setNewSteps] = useState("");
  const [knowledgeTitle, setKnowledgeTitle] = useState("");
  const [knowledgeText, setKnowledgeText] = useState("");
  const [savingKnowledge, setSavingKnowledge] = useState(false);
  const [managementError, setManagementError] = useState("");

  useEffect(() => {
    fetch(`/api/brains/${id}`).then((r) => r.json()).then(setData);
  }, [id]);

  async function refreshBrain() {
    if (!data) return;
    const refreshed = await fetch(`/api/brains/${data.brain.id}`).then((r) => r.json());
    setData(refreshed);
  }

  async function addKnowledge(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!data || !knowledgeTitle.trim() || !knowledgeText.trim() || savingKnowledge) return;
    setSavingKnowledge(true);
    setManagementError("");
    try {
      const response = await fetch(`/api/brains/${data.brain.id}/chunks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: knowledgeTitle, text: knowledgeText }),
      });
      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(result.error || "Impossible d’ajouter cette connaissance.");
      }
      setKnowledgeTitle("");
      setKnowledgeText("");
      await refreshBrain();
    } catch (error) {
      setManagementError(error instanceof Error ? error.message : "Une erreur est survenue.");
    } finally {
      setSavingKnowledge(false);
    }
  }

  async function deleteKnowledge(chunkId: string) {
    if (!data || !confirm("Supprimer cette connaissance du Brain ?")) return;
    const response = await fetch(`/api/brains/${data.brain.id}/chunks?chunkId=${encodeURIComponent(chunkId)}`, { method: "DELETE" });
    if (!response.ok) {
      setManagementError("La suppression de cette connaissance a échoué.");
      return;
    }
    await refreshBrain();
  }

  async function deleteRecording(recordingId: string) {
    if (!data || !confirm("Supprimer cette session et les procédures issues de cette session ?")) return;
    const response = await fetch(`/api/recordings?id=${encodeURIComponent(recordingId)}`, { method: "DELETE" });
    if (!response.ok) {
      setManagementError("La suppression de cette session a échoué.");
      return;
    }
    await refreshBrain();
  }

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

  const visualItems: BrainVisualItem[] = [
    ...data.sops.map((s) => ({
      id: s.id,
      kind: "process" as const,
      title: s.title,
      description: s.steps.map((step) => step.title + " — " + step.instruction).join(" "),
    })),
    ...data.recordings.map((recording) => ({
      id: recording.id,
      kind: "session" as const,
      title: recording.title,
      description: "Session de " + Math.ceil(recording.durationSec / 60) + " min · " +
        (recording.transcript?.map((segment) => segment.text).join(" ") || "Aucune transcription disponible."),
    })),
    ...(data.insights ?? []).map((insight) => ({
      id: insight.id,
      kind: "insight" as const,
      title: insight.title,
      description: insight.detail,
    })),
    ...data.chunks.filter((chunk) => chunk.kind === "document").map((chunk) => ({
      id: chunk.id,
      kind: "knowledge" as const,
      title: chunk.text.split("\n")[0] || "Connaissance manuelle",
      description: chunk.text.split("\n\n").slice(1).join("\n\n") || chunk.text,
    })),
    ...data.graph.map((node) => ({
      id: node.type + ":" + node.name,
      kind: "dependency" as const,
      title: node.name,
      description: (node.type === "tool" ? "Outil" : "Contact") + " relié à " + node.linkedSops.length + " procédure(s).",
    })),
  ];

  return (
    <div className="brain-manager">
      <aside className="brain-manager__sidebar">
        <div className="brain-manager__sidebar-top">
          <Link href="/brains" className="brain-manager__back">← Tous les Brains</Link>
          <Link href="/brains" className="brain-manager__brand" aria-label="Omi, revenir aux Brains">
            <span className="brain-manager__brand-mark">O</span><span>Omi</span>
          </Link>
        </div>

        <section className="brain-manager__identity" aria-label="Brain sélectionné">
          <p className="brain-manager__eyebrow">BRAIN · ESPACE DE CONNAISSANCE</p>
          <h1>{data.brain.name}</h1>
          <p>{data.brain.description || "Mémoire du poste et des méthodes de l’équipe."}</p>
        </section>

        <nav className="brain-manager__nav" aria-label="Gérer les informations du Brain">
          <button type="button" className={activePanel === "map" ? "is-active" : ""} aria-current={activePanel === "map" ? "page" : undefined} onClick={() => setActivePanel("map")}>
            <span className="brain-manager__nav-icon" aria-hidden="true">◎</span><span>Carte du Brain</span><strong>{visualItems.length}</strong>
          </button>
          <button type="button" className={activePanel === "sessions" ? "is-active" : ""} aria-current={activePanel === "sessions" ? "page" : undefined} onClick={() => setActivePanel("sessions")}>
            <span className="brain-manager__nav-icon" aria-hidden="true">◷</span><span>Sessions sources</span><strong>{data.recordings.length}</strong>
          </button>
          <button type="button" className={activePanel === "knowledge" ? "is-active" : ""} aria-current={activePanel === "knowledge" ? "page" : undefined} onClick={() => setActivePanel("knowledge")}>
            <span className="brain-manager__nav-icon" aria-hidden="true">◇</span><span>Notes manuelles</span><strong>{data.chunks.filter((chunk) => chunk.kind === "document").length}</strong>
          </button>
          <button type="button" className={activePanel === "procedures" ? "is-active" : ""} aria-current={activePanel === "procedures" ? "page" : undefined} onClick={() => setActivePanel("procedures")}>
            <span className="brain-manager__nav-icon" aria-hidden="true">⌘</span><span>Procédures & contexte</span><strong>{data.sops.length + data.insights.length}</strong>
          </button>
        </nav>

        <details className="brain-manager__settings">
          <summary><span aria-hidden="true">⚙</span> Paramètres du Brain</summary>
          <dl>
            <div><dt>Responsable</dt><dd>{data.brain.owner || "Non renseigné"}</dd></div>
          </dl>
          {data.brain.referenceDuties.length > 0 && (
            <div className="brain-manager__duties">
              <span>Contexte du poste</span>
              <ul>{data.brain.referenceDuties.map((duty, index) => <li key={index}>{duty}</li>)}</ul>
            </div>
          )}
        </details>

        <div className="brain-manager__sidebar-footer"><span />Brain synchronisé</div>
      </aside>

      <main className="brain-manager__content" aria-label="Contenu du Brain">
        {activePanel === "map" && (
          <div className="brain-manager__map-view">
      <BrainVisualization items={visualItems} />
          </div>
        )}


      {activePanel === "sessions" && <section className="brain-manager__data-panel app-recordings-panel">
        <div className="app-recordings-panel__heading">
          <div><h2>Sessions sources</h2><p>Transcriptions à l’origine des procédures et connaissances.</p></div>
          <span>{data.recordings.length} session(s)</span>
        </div>
        {data.recordings.length ? (
          <div className="app-recordings-list">
            {data.recordings.map((recording) => (
              <details key={recording.id} className="app-recording-item">
                <summary><strong>{recording.title}</strong><span>{Math.ceil(recording.durationSec / 60)} min · {recording.sensitiveMasked} donnée(s) masquée(s)</span></summary>
                <div className="app-recording-transcript">
                  {recording.transcript?.length ? recording.transcript.map((segment, index) => (
                    <p key={index}><time>{Math.floor(segment.start / 60)}:{String(segment.start % 60).padStart(2, "0")}</time>{segment.text}</p>
                  )) : <p>Aucune transcription disponible.</p>}
                </div>
                <div className="app-recording-actions">
                  <button type="button" onClick={() => deleteRecording(recording.id)}>Supprimer la session et ses procédures</button>
                </div>
              </details>
            ))}
          </div>
        ) : <p className="app-recordings-empty">Aucune session n’est encore associée à ce Brain.</p>}
      </section>}

      {activePanel === "knowledge" && <section className="brain-manager__data-panel app-knowledge-panel">
        <div className="app-recordings-panel__heading">
          <div><h2>Connaissances ajoutées à la main</h2><p>Ces notes sont intégrées à la recherche de l’agent Omi.</p></div>
          <span>{data.chunks.filter((chunk) => chunk.kind === "document").length} note(s)</span>
        </div>
        <form className="app-knowledge-form" onSubmit={addKnowledge}>
          <label>
            <span>Titre</span>
            <input value={knowledgeTitle} onChange={(e) => setKnowledgeTitle(e.target.value)} maxLength={180} required placeholder="Ex. Convention de nommage" />
          </label>
          <label>
            <span>Contenu</span>
            <textarea value={knowledgeText} onChange={(e) => setKnowledgeText(e.target.value)} maxLength={20000} required rows={4} placeholder="Ajoutez une règle, un contexte ou une information utile…" />
          </label>
          {managementError && <p className="app-knowledge-error" role="alert">{managementError}</p>}
          <button type="submit" disabled={savingKnowledge || !knowledgeTitle.trim() || !knowledgeText.trim()}>
            {savingKnowledge ? "Ajout…" : "Ajouter cette connaissance"}
          </button>
        </form>
        <div className="app-knowledge-list">
          {data.chunks.filter((chunk) => chunk.kind === "document").map((chunk) => {
            const [title, ...body] = chunk.text.split("\n\n");
            return (
              <article key={chunk.id}>
                <div><span>NOTE MANUELLE</span><h3>{title}</h3><p>{body.join("\n\n")}</p></div>
                <button type="button" onClick={() => deleteKnowledge(chunk.id)} aria-label={"Supprimer " + title}>Supprimer</button>
              </article>
            );
          })}
        </div>
      </section>}

      {activePanel === "procedures" && <div className="brain-manager__data-panel app-brain-detail-grid grid gap-8 lg:grid-cols-2">
        <section className="app-brain-detail-section space-y-4">
          <h2 className="text-xl font-semibold text-text-strong">SOP indexées</h2>
          {data.sops.map((s) => (
            <details key={s.id} className="app-detail-card rounded-none border border-line bg-paper-raised p-4">
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
              Projets, difficultés et points d&apos;attention mémorisés automatiquement par Omi.
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

      </div>}
      </main>
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
