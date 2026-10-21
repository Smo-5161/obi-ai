"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";

interface Sop {
  id: string;
  title: string;
  frequency: string;
  steps: { id: string; order: number; title: string; instruction: string; tool?: string }[];
  tools: string[];
  contacts: string[];
}

interface BrainDetail {
  brain: { id: string; name: string; owner: string; description: string; referenceDuties: string[] };
  sops: Sop[];
  recordings: { id: string; title: string; durationSec: number; sensitiveMasked: number }[];
  graph: { type: string; name: string; linkedSops: string[] }[];
  coverage: number;
}

interface Msg {
  role: "user" | "assistant";
  content: string;
  citations?: string[];
}

export default function BrainClient() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<BrainDetail | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [question, setQuestion] = useState("");
  const [asking, setAsking] = useState(false);
  const [inboarder, setInboarder] = useState("Nouveau collaborateur");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`/api/brains/${id}`).then((r) => r.json()).then(setData);
  }, [id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function ask(q?: string) {
    const content = (q ?? question).trim();
    if (!content || asking) return;
    setMessages((m) => [...m, { role: "user", content }]);
    setQuestion("");
    setAsking(true);
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ brainId: id, question: content, inboarderName: inboarder }),
    });
    const msg = await res.json();
    setMessages((m) => [...m, { role: "assistant", content: msg.content, citations: msg.citations }]);
    setAsking(false);
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
                {s.title}
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
                <button
                  onClick={() => complete(s.id)}
                  className="rounded bg-accent px-2 py-1 text-xs text-white hover:bg-accent-bright"
                >
                  ✓ Tâche maîtrisée
                </button>
              </div>
            </details>
          ))}

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

        <section className="flex flex-col rounded-none border border-line bg-paper-raised p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-text-strong">Omi Companion</h2>
            <input
              value={inboarder}
              onChange={(e) => setInboarder(e.target.value)}
              className="w-40 rounded bg-background px-2 py-1 text-xs text-foreground"
            />
          </div>
          <div className="h-96 space-y-3 overflow-y-auto rounded-none bg-background p-3">
            {messages.length === 0 && (
              <p className="text-sm text-muted">
                Pose ta question à Omi, il connaît tous les processus de ce poste.
              </p>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] whitespace-pre-wrap rounded-none p-3 text-sm ${
                  m.role === "user" ? "ml-auto bg-accent text-white" : "bg-background text-foreground"
                }`}
              >
                {m.content}
                {m.citations?.length ? (
                  <div className="mt-2 text-xs text-muted">
                    Références : {m.citations.length} extrait(s) du Brain
                  </div>
                ) : null}
              </div>
            ))}
            {asking && <div className="rounded-none bg-background p-3 text-sm text-muted">Omi réfléchit…</div>}
            <div ref={bottomRef} />
          </div>
          {data.sops[0] && (
            <div className="mt-2 flex flex-wrap gap-2">
              {data.sops.slice(0, 2).map((s) => (
                <button
                  key={s.id}
                  onClick={() => ask(`Comment effectuer « ${s.title} » ?`)}
                  className="rounded-none border border-line px-3 py-1 text-xs text-foreground hover:border-accent"
                >
                  Comment faire « {s.title} » ?
                </button>
              ))}
            </div>
          )}
          <div className="mt-2 flex gap-2">
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && ask()}
              placeholder="Ex: Comment effectuer le reporting mensuel sur Supabase ?"
              className="flex-1 rounded-none bg-background p-2 text-sm text-text-strong"
            />
            <button
              onClick={() => ask()}
              disabled={asking}
              className="rounded-none bg-accent px-4 text-sm font-medium text-white disabled:opacity-50"
            >
              Envoyer
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
