import { NextRequest, NextResponse } from "next/server";
import { loadDb, saveDb } from "@/lib/store";
import { runIngestionPipeline } from "@/lib/pipeline";

const SEED_BRAIN = {
  name: "Contrôleur de Gestion — Reporting",
  owner: "Camille (outboarder)",
  scope: "job" as const,
  description: "Poste de contrôleur de gestion: reporting mensuel, suivi budget, closing.",
  referenceDuties: [
    "Reporting mensuel sur Supabase",
    "Relance des budgets par email",
    "Closing trimestriel",
    "Mise à jour du tableau de bord Finance",
  ],
};

const SEED_RECORDINGS = [
  {
    title: "Reporting mensuel sur Supabase",
    durationSec: 640,
    transcript: [
      { start: 0, end: 14, text: "Bonjour, voici comment effectuer le reporting mensuel sur Supabase. Ouvre d'abord le dashboard Supabase." },
      { start: 15, end: 40, text: "Je me connecte avec le compte finance, le mot de passe est dans le coffre-fort 1Password, ne le partage jamais par email." },
      { start: 41, end: 80, text: "Ensuite, va dans la table monthly_reporting et exécute la requête SQL savee dans les snippets 'closing_v3'." },
      { start: 81, end: 120, text: "Puis exporte le résultat en CSV et colle-le dans Google Sheets 'Reporting 2025', onglet Data." },
      { start: 121, end: 160, text: "Si les chiffres du mois sont incohérents, contacte Karim du pôle Data, il valide les pipelines avant le 5 du mois." },
    ],
    actionLogs: [
      { timestamp: 5, type: "navigate" as const, app: "Chrome", url: "https://supabase.com/dashboard" },
      { timestamp: 18, type: "input" as const, app: "Chrome", target: "password" },
      { timestamp: 45, type: "click" as const, app: "Chrome", target: "SQL Editor" },
      { timestamp: 60, type: "shortcut" as const, app: "Chrome", target: "Cmd+Enter" },
      { timestamp: 90, type: "navigate" as const, app: "Chrome", url: "https://docs.google.com/spreadsheets" },
      { timestamp: 130, type: "click" as const, app: "Slack", target: "DM Karim" },
    ],
  },
  {
    title: "Relance budgets par email",
    durationSec: 420,
    transcript: [
      { start: 0, end: 15, text: "Chaque semaine, je relance les responsables de budget qui n'ont pas saisi leurs dépenses." },
      { start: 16, end: 60, text: "J'ouvre Outlook, filtre la boîte 'budget@company.com' sur les messages non lus, et j'envoie le template de relance." },
      { start: 61, end: 90, text: "Le template est dans le dossier partagé Finance/Templates. Personnalise la première ligne avec le nom du manager." },
    ],
    actionLogs: [
      { timestamp: 5, type: "navigate" as const, app: "Outlook", url: "https://outlook.office.com" },
      { timestamp: 20, type: "click" as const, app: "Outlook", target: "Filter unread" },
      { timestamp: 65, type: "navigate" as const, app: "Explorer", url: "file://Finance/Templates" },
    ],
  },
];

export async function POST(req: NextRequest) {
  const force = req.nextUrl.searchParams.get("force") === "true";
  const db = await loadDb();
  if (db.brains.length > 0 && !force) {
    return NextResponse.json({ message: "Data already seeded", brains: db.brains.length });
  }
  if (force) {
    db.brains = [];
    db.recordings = {};
    db.sops = {};
    db.chunks = [];
    db.messages = [];
    db.progress = {};
  }
  const id = `brain_${Math.random().toString(36).slice(2, 10)}`;
  db.brains.push({ ...SEED_BRAIN, id, createdAt: new Date().toISOString() });
  for (const rec of SEED_RECORDINGS) {
    await runIngestionPipeline(db, id, rec);
  }
  await saveDb(db);
  return NextResponse.json({ message: "Seed complete", brainId: id });
}
