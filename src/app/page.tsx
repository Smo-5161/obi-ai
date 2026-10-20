import Link from "next/link";

const epics = [
  {
    title: "Obi Recorder",
    desc: "Capture écran + voix + actions. Transcription auto, découpage en SOP, masquage des données sensibles.",
    href: "/recorder",
  },
  {
    title: "Job Brain",
    desc: "Base de connaissances vectorielle par fiche de poste, avec graphe d'outils et contacts clés.",
    href: "/brains",
  },
  {
    title: "Obi Companion",
    desc: "Agent conversationnel qui guide le nouveau collaborateur, avec références aux extraits du prédécesseur.",
    href: "/brains",
  },
  {
    title: "Obi Analytics",
    desc: "Matrice de couverture, onboarding velocity et analyse des points de blocage.",
    href: "/analytics",
  },
];

export default function Home() {
  return (
    <div className="space-y-12">
      <section className="rounded-2xl bg-gradient-to-br from-indigo-600 to-slate-900 p-10 text-white">
        <h1 className="text-4xl font-bold">Transmets ton poste sans perdre une seule connaissance.</h1>
        <p className="mt-4 max-w-2xl text-lg text-indigo-100">
          Obi.ai capture les processus métiers du collaborateur sortant, construit un « Brain »
          vectoriel du poste, et accompagne le nouvel arrivant pas à pas — zéro intervention humaine requise.
        </p>
        <div className="mt-6 flex gap-4">
          <Link href="/recorder" className="rounded-lg bg-white px-5 py-2.5 font-medium text-slate-900 hover:bg-indigo-100">
            Lancer un enregistrement
          </Link>
          <Link href="/brains" className="rounded-lg border border-white/40 px-5 py-2.5 font-medium hover:bg-white/10">
            Explorer les Brains
          </Link>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {epics.map((e) => (
          <Link key={e.title} href={e.href} className="rounded-xl border border-slate-800 bg-slate-900 p-5 hover:border-indigo-500">
            <h2 className="font-semibold text-slate-100">{e.title}</h2>
            <p className="mt-2 text-sm text-slate-400">{e.desc}</p>
          </Link>
        ))}
      </section>

      <section className="rounded-xl border border-slate-800 p-6">
        <h2 className="text-xl font-semibold text-slate-100">KPIs cibles</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {[
            ["Time-to-Autonomy", "−60% pour exécuter une tâche complexe seul"],
            ["Time Spent Training", "−90% de temps des équipes à former"],
            ["Obi Coverage Score", "% de complétude du Brain vs fiche de poste"],
          ].map(([k, v]) => (
            <div key={k} className="rounded-lg bg-slate-900 p-4">
              <div className="font-medium text-indigo-400">{k}</div>
              <div className="mt-1 text-sm text-slate-400">{v}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
