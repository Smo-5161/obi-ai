"use client";

import { useEffect, useRef, useState } from "react";

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

export default function BrainClient({ brainId }: { brainId: string }) {
  const id = brainId;
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

  if (!data) return <p className="text-slate-400">Chargement du Brain…</p>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-100">{data.brain.name}</h1>
        <p className="mt-1 text-slate-400">{data.brain.description || data.brain.owner}</p>
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          <span className="rounded-full bg-indigo-950 px-3 py-1 text-indigo-300">
            Couverture : {data.coverage}%
          </span>
          <span className="rounded-full bg-slate-800 px-3 py-1 text-slate-300">
            {data.sops.length} SOP · {data.recordings.length} enregistrement(s)
          </span>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-100">SOP indexées</h2>
          {data.sops.map((s) => (
            <details key={s.id} className="rounded-xl border border-slate-800 bg-slate-900 p-4">
              <summary className="cursor-pointer font-medium text-slate-100">
                {s.title}
                <span className="ml-2 text-xs text-slate-500">{s.frequency}</span>
              </summary>
              <ol className="mt-3 space-y-2 text-sm text-slate-300">
                {s.steps.map((st) => (
                  <li key={st.id} className="rounded bg-slate-800 p-2">
                    <span className="text-indigo-400">{st.order}.</span> <strong>{st.title}</strong>
                    <p className="text-slate-400">{st.instruction}</p>
                    {st.tool && <p className="mt-1 text-xs text-slate-500">Outil : {st.tool}</p>}
                  </li>
                ))}
              </ol>
              <div className="mt-3 flex items-center justify-between">
                <div className="text-xs text-slate-500">
                  Outils : {s.tools.join(", ") || "—"} · Contacts : {s.contacts.join(", ") || "—"}
                </div>
                <button
                  onClick={() => complete(s.id)}
                  className="rounded bg-emerald-800 px-2 py-1 text-xs text-white hover:bg-emerald-700"
                >
                  ✓ Tâche maîtrisée
                </button>
              </div>
            </details>
          ))}

          <h2 className="pt-4 text-xl font-semibold text-slate-100">Graphe de dépendances</h2>
          <div className="flex flex-wrap gap-2">
            {data.graph.map((n) => (
              <span
                key={`${n.type}:${n.name}`}
                className={`rounded-full px-3 py-1 text-sm ${
                  n.type === "tool" ? "bg-amber-950 text-amber-300" : "bg-teal-950 text-teal-300"
                }`}
              >
                {n.type === "tool" ? "🛠" : "👤"} {n.name}
                <span className="ml-1 text-xs opacity-60">({n.linkedSops.length})</span>
              </span>
            ))}
            {!data.graph.length && <p className="text-sm text-slate-500">Aucune dépendance cartographiée.</p>}
          </div>
        </section>

        <section className="flex flex-col rounded-xl border border-slate-800 bg-slate-900 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-100">Obi Companion</h2>
            <input
              value={inboarder}
              onChange={(e) => setInboarder(e.target.value)}
              className="w-40 rounded bg-slate-800 px-2 py-1 text-xs text-slate-300"
            />
          </div>
          <div className="h-96 space-y-3 overflow-y-auto rounded-lg bg-slate-950 p-3">
            {messages.length === 0 && (
              <p className="text-sm text-slate-500">
                Pose ta question à Obi, il connaît tous les processus de ce poste.
              </p>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] whitespace-pre-wrap rounded-lg p-3 text-sm ${
                  m.role === "user" ? "ml-auto bg-indigo-700 text-white" : "bg-slate-800 text-slate-200"
                }`}
              >
                {m.content}
                {m.citations?.length ? (
                  <div className="mt-2 text-xs text-slate-400">
                    Références : {m.citations.length} extrait(s) du Brain
                  </div>
                ) : null}
              </div>
            ))}
            {asking && <div className="rounded-lg bg-slate-800 p-3 text-sm text-slate-400">Obi réfléchit…</div>}
            <div ref={bottomRef} />
          </div>
          {data.sops[0] && (
            <div className="mt-2 flex flex-wrap gap-2">
              {data.sops.slice(0, 2).map((s) => (
                <button
                  key={s.id}
                  onClick={() => ask(`Comment effectuer « ${s.title} » ?`)}
                  className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300 hover:border-indigo-500"
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
              className="flex-1 rounded-lg bg-slate-800 p-2 text-sm text-slate-100"
            />
            <button
              onClick={() => ask()}
              disabled={asking}
              className="rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white disabled:opacity-50"
            >
              Envoyer
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
