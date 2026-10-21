"use client";

import { useState } from "react";

interface DemoSop {
  id: string;
  title: string;
  frequency: string;
  steps: { order: number; title: string; instruction: string; tool?: string }[];
  tools: string[];
  contacts: string[];
}

const DEMO_SOPS: DemoSop[] = [
  {
    id: "demo-sop-1",
    title: "Reporting mensuel sur Supabase",
    frequency: "monthly",
    steps: [
      { order: 1, title: "Ouvrir le dashboard Supabase", instruction: "Se connecter avec le compte finance du coffre-fort 1Password.", tool: "Supabase" },
      { order: 2, title: "Exécuter la requête SQL", instruction: "Dans le SQL Editor, exécuter le snippet « closing_v3 » sur la table monthly_reporting.", tool: "Supabase" },
      { order: 3, title: "Exporter en CSV", instruction: "Exporter le résultat et le coller dans Google Sheets « Reporting 2025 », onglet Data.", tool: "Google Sheets" },
      { order: 4, title: "Vérifier les chiffres", instruction: "Si les montants semblent incohérents, contacter Karim du pôle Data pour valider les pipelines.", tool: "Slack" },
    ],
    tools: ["Supabase", "Google Sheets", "Slack"],
    contacts: ["Karim (pôle Data)"],
  },
  {
    id: "demo-sop-2",
    title: "Relance budgets par email",
    frequency: "weekly",
    steps: [
      { order: 1, title: "Filtrer la boîte budget", instruction: "Dans Outlook, filtrer les messages non lus de budget@company.com.", tool: "Outlook" },
      { order: 2, title: "Envoyer le template de relance", instruction: "Utiliser le modèle du dossier Finance/Templates et personnaliser la première ligne.", tool: "Outlook" },
    ],
    tools: ["Outlook"],
    contacts: [],
  },
];

const DEMO_ANSWERS: { match: string[]; answer: string }[] = [
  {
    match: ["reporting", "supabase", "mensuel"],
    answer:
      "D'après le Brain de ce poste, le reporting mensuel se fait ainsi :\n\n1. Ouvrir le dashboard Supabase (compte finance, mot de passe dans le coffre 1Password)\n2. Exécuter la requête SQL « closing_v3 » sur la table monthly_reporting\n3. Exporter en CSV et coller dans Google Sheets « Reporting 2025 »\n4. Si les chiffres semblent faux, contacter Karim du pôle Data\n\nSource : transcription de la session « Reporting mensuel sur Supabase » [02:14 → 04:30]",
  },
  {
    match: ["budget", "relance", "email", "outlook"],
    answer:
      "Pour les relances budget (chaque semaine) :\n\n1. Filtrer les non lus de budget@company.com dans Outlook\n2. Envoyer le template du dossier Finance/Templates, première ligne personnalisée\n\nSource : transcription de la session « Relance budgets par email » [00:00 → 01:40]",
  },
];

export default function BrainDemo() {
  const [activeSop, setActiveSop] = useState(DEMO_SOPS[0].id);
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([
    {
      role: "assistant",
      content:
        "Bonjour, je suis Obi. Posez-moi une question sur ce poste de démonstration (ex : « Comment effectuer le reporting mensuel sur Supabase ? »).",
    },
  ]);
  const [question, setQuestion] = useState("");

  const sop = DEMO_SOPS.find((s) => s.id === activeSop) ?? DEMO_SOPS[0];

  function ask() {
    const q = question.trim();
    if (!q) return;
    setMessages((m) => [...m, { role: "user", content: q }]);
    setQuestion("");
    const lq = q.toLowerCase();
    const found = DEMO_ANSWERS.find((a) => a.match.some((kw) => lq.includes(kw)));
    setMessages((m) => [
      ...m,
      {
        role: "assistant",
        content: found
          ? found.answer
          : "Je n'ai pas encore de connaissance indexée sur ce sujet dans ce Brain de démonstration. Essayez une question sur le reporting Supabase ou les relances budget.",
      },
    ]);
  }

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {/* SOP + graphe */}
      <div className="space-y-4">
        <div className="flex gap-2">
          {DEMO_SOPS.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSop(s.id)}
              className={`border-2 px-3 py-1.5 text-xs font-bold ${
                s.id === activeSop
                  ? "border-ink bg-accent text-background"
                  : "border-line bg-paper-raised text-text-strong"
              }`}
            >
              {s.title}
            </button>
          ))}
        </div>

        <div className="border-2 border-line bg-paper-raised p-5 shadow-[4px_4px_0_0_var(--line)]">
          <p className="text-xs font-bold uppercase tracking-wide text-accent">
            SOP — {sop.frequency}
          </p>
          <h3 className="mt-1 text-lg font-bold text-text-strong">{sop.title}</h3>
          <ol className="mt-4 space-y-2 text-sm text-foreground">
            {sop.steps.map((st) => (
              <li key={st.order} className="border-2 border-line bg-background p-2.5">
                <span className="font-bold text-accent">{st.order}.</span>{" "}
                <strong className="text-text-strong">{st.title}</strong>
                <p className="mt-0.5 text-muted">{st.instruction}</p>
                {st.tool && <p className="mt-1 text-xs text-muted">Outil : {st.tool}</p>}
              </li>
            ))}
          </ol>
          <p className="mt-3 text-xs text-muted">
            Outils : {sop.tools.join(", ")} · Contacts : {sop.contacts.join(", ") || "—"}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {["Supabase", "Google Sheets", "Slack", "Outlook", "Karim (pôle Data)"].map((t) => (
            <span
              key={t}
              className={`border-2 px-3 py-1 text-xs ${
                t.includes("Karim")
                  ? "border-ink bg-background text-text-strong"
                  : "border-accent bg-accent-soft text-text-strong"
              }`}
            >
              {t.includes("Karim") ? "•" : "•"} {t}
            </span>
          ))}
        </div>
      </div>

      {/* Chat */}
      <div className="flex flex-col border-2 border-line bg-paper-raised p-4 shadow-[4px_4px_0_0_var(--line)]">
        <p className="text-xs font-bold uppercase tracking-wide text-accent">Obi Companion</p>
        <div className="mt-2 h-72 space-y-3 overflow-y-auto border-2 border-line bg-background p-3">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-[85%] whitespace-pre-wrap border-2 p-2.5 text-sm ${
                m.role === "user"
                  ? "ml-auto border-ink bg-accent text-background"
                  : "border-line bg-paper-raised text-foreground"
              }`}
            >
              {m.content}
            </div>
          ))}
        </div>
        <div className="mt-2 flex gap-2">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && ask()}
            placeholder="Ex: Comment faire le reporting mensuel ?"
            className="min-w-0 flex-1 border-2 border-line bg-background p-2 text-sm text-text-strong"
          />
          <button
            onClick={ask}
            className="shrink-0 border-2 border-ink bg-accent px-4 text-sm font-bold text-background shadow-[2px_2px_0_0_var(--ink)]"
          >
            Envoyer
          </button>
        </div>
        <p className="mt-2 text-center text-xs text-muted">
          Démo interactive — données fictives, aucune inscription requise.
        </p>
      </div>
    </div>
  );
}
