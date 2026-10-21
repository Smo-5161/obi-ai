"use client";

import { useState } from "react";
import Link from "next/link";

interface DemoSop {
  id: string;
  title: string;
  frequency: string;
  steps: { order: number; title: string; instruction: string; tool?: string }[];
  tools: string[];
  contacts: string[];
}

interface DemoMessage {
  role: "user" | "assistant";
  content: string;
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
      "D'après le Brain de ce poste, le reporting mensuel se fait ainsi :\n\n1. Ouvrir le dashboard Supabase (compte finance, mot de passe dans le coffre 1Password)\n2. Exécuter la requête SQL « closing_v3 » sur la table monthly_reporting\n3. Exporter en CSV et coller dans Google Sheets « Reporting 2025 »\n4. Si les chiffres semblent faux, contacter Karim du pôle Data\n\nSource : transcription de la session « Reporting mensuel sur Supabase » [extrait 02:14 → 04:30]",
  },
  {
    match: ["budget", "relance", "email", "outlook"],
    answer:
      "Pour les relances budget (chaque semaine) :\n\n1. Filtrer les non lus de budget@company.com dans Outlook\n2. Envoyer le template du dossier Finance/Templates, première ligne personnalisée\n\nSource : transcription de la session « Relance budgets par email » [extrait 00:00 → 01:40]",
  },
];

const DEMO_METRICS = {
  coverageScore: 50,
  sopCount: 2,
  recordingCount: 2,
  maskedItems: 3,
  dailySharePercent: 0,
  weeklySharePercent: 50,
  onboardingVelocityPercent: 25,
  askedQuestions: 4,
  blockingTopics: { "export csv": 2, "droits supabase": 1 },
};

export default function DemoDashboardPage() {
  const [tab, setTab] = useState<"brains" | "analytics">("brains");
  const [sops] = useState(DEMO_SOPS);
  const [messages, setMessages] = useState<DemoMessage[]>([
    {
      role: "assistant",
      content:
        "Bonjour, je suis Obi. Je connais les processus de ce poste de démonstration. Posez-moi une question (ex : « Comment effectuer le reporting mensuel sur Supabase ? »).",
    },
  ]);
  const [question, setQuestion] = useState("");

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
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-text-strong">Contrôleur de Gestion — Reporting</h1>
          <p className="mt-1 text-muted">
            Brain de démonstration — données fictives, aucune connexion à une base réelle.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setTab("brains")}
            className={`border-2 px-4 py-2 text-sm font-bold ${
              tab === "brains"
                ? "border-ink bg-accent text-background"
                : "border-line bg-paper-raised text-text-strong"
            }`}
          >
            Brain
          </button>
          <button
            onClick={() => setTab("analytics")}
            className={`border-2 px-4 py-2 text-sm font-bold ${
              tab === "analytics"
                ? "border-ink bg-accent text-background"
                : "border-line bg-paper-raised text-text-strong"
            }`}
          >
            Analytics
          </button>
        </div>
      </div>

      {tab === "brains" && (
        <div className="grid gap-8 lg:grid-cols-2">
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-text-strong">SOP indexées</h2>
            {sops.map((s) => (
              <details key={s.id} className="border-2 border-line bg-paper-raised p-4 shadow-[3px_3px_0_0_var(--line)]">
                <summary className="cursor-pointer font-bold text-text-strong">
                  {s.title}
                  <span className="ml-2 text-xs text-muted">{s.frequency}</span>
                </summary>
                <ol className="mt-3 space-y-2 text-sm text-foreground">
                  {s.steps.map((st) => (
                    <li key={st.order} className="border border-line bg-background p-2">
                      <span className="font-bold text-accent">{st.order}.</span>{" "}
                      <strong>{st.title}</strong>
                      <p className="text-muted">{st.instruction}</p>
                      {st.tool && <p className="mt-1 text-xs text-muted">Outil : {st.tool}</p>}
                    </li>
                  ))}
                </ol>
                <p className="mt-3 text-xs text-muted">
                  Outils : {s.tools.join(", ")} · Contacts : {s.contacts.join(", ") || "—"}
                </p>
              </details>
            ))}
            <div className="flex flex-wrap gap-2">
              {["Supabase", "Google Sheets", "Slack", "Outlook"].map((t) => (
                <span key={t} className="border-2 border-accent bg-accent-soft px-3 py-1 text-sm text-text-strong">
                  🛠 {t}
                </span>
              ))}
            </div>
          </section>

          <section className="flex flex-col border-2 border-line bg-paper-raised p-4 shadow-[4px_4px_0_0_var(--line)]">
            <h2 className="text-xl font-bold text-text-strong">Obi Companion</h2>
            <div className="mt-3 h-80 space-y-3 overflow-y-auto border-2 border-line bg-background p-3">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`max-w-[85%] whitespace-pre-wrap border-2 p-3 text-sm ${
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
                placeholder="Ex: Comment effectuer le reporting mensuel sur Supabase ?"
                className="flex-1 border-2 border-line bg-background p-2 text-sm text-text-strong"
              />
              <button onClick={ask} className="border-2 border-ink bg-accent px-4 text-sm font-bold text-background shadow-[2px_2px_0_0_var(--ink)]">
                Envoyer
              </button>
            </div>
          </section>
        </div>
      )}

      {tab === "analytics" && (
        <section className="space-y-6 border-2 border-line bg-paper-raised p-6 shadow-[4px_4px_0_0_var(--line)]">
          <h2 className="text-xl font-bold text-text-strong">Obi Analytics (démo)</h2>
          {[
            ["Obi Coverage Score", DEMO_METRICS.coverageScore],
            ["Onboarding Velocity", DEMO_METRICS.onboardingVelocityPercent],
            ["Tâches hebdomadaires capturées", DEMO_METRICS.weeklySharePercent],
          ].map(([label, value]) => (
            <div key={label as string}>
              <div className="flex justify-between text-sm text-foreground">
                <span>{label}</span>
                <span className="font-bold">{value}%</span>
              </div>
              <div className="mt-1 h-2 w-full border border-line bg-background">
                <div className="h-full bg-accent" style={{ width: `${value}%` }} />
              </div>
            </div>
          ))}
          <div className="grid grid-cols-3 gap-2 text-center text-sm">
            <div className="border-2 border-line bg-background p-2">
              <div className="text-lg font-bold text-text-strong">{DEMO_METRICS.sopCount}</div>
              <div className="text-xs text-muted">SOP</div>
            </div>
            <div className="border-2 border-line bg-background p-2">
              <div className="text-lg font-bold text-text-strong">{DEMO_METRICS.recordingCount}</div>
              <div className="text-xs text-muted">Enregistrements</div>
            </div>
            <div className="border-2 border-line bg-background p-2">
              <div className="text-lg font-bold text-text-strong">{DEMO_METRICS.maskedItems}</div>
              <div className="text-xs text-muted">PII masquées</div>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-bold text-text-strong">Questions posées : {DEMO_METRICS.askedQuestions}</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {Object.entries(DEMO_METRICS.blockingTopics).map(([t, n]) => (
                <span key={t} className="border-2 border-accent bg-accent-soft px-3 py-1 text-xs text-text-strong">
                  {t} ×{n}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      <p className="text-center text-sm text-muted">
        Ceci est une démonstration statique.{" "}
        <Link href="/signup" className="text-accent underline">
          Créez un compte
        </Link>{" "}
        pour utiliser Obi avec vos propres processus.
      </p>
    </div>
  );
}
