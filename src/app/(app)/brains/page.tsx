"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Brain {
  id: string;
  name: string;
  owner: string;
  scope: string;
}

export default function BrainsPage() {
  const [brains, setBrains] = useState<Brain[]>([]);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    fetch("/api/brains")
      .then((r) => r.json())
      .then(setBrains);
  }, []);

  async function seed() {
    setSeeding(true);
    await fetch("/api/seed", { method: "POST" });
    const res = await fetch("/api/brains");
    setBrains(await res.json());
    setSeeding(false);
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Job Brains</h1>
          <p className="mt-1 text-slate-400">Bases de connaissances vectorielles par poste, pôle ou projet.</p>
        </div>
        <button
          onClick={seed}
          disabled={seeding}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {seeding ? "Génération…" : "Charger le jeu de démonstration"}
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {brains.map((b) => (
          <Link
            key={b.id}
            href={`/brains/${b.id}`}
            className="rounded-xl border border-slate-800 bg-slate-900 p-5 hover:border-indigo-500"
          >
            <div className="text-lg font-semibold text-slate-100">{b.name}</div>
            <div className="mt-1 text-sm text-slate-400">{b.owner || "Sans propriétaire"}</div>
            <span className="mt-3 inline-block rounded-full bg-indigo-950 px-2 py-0.5 text-xs text-indigo-300">
              {b.scope}
            </span>
          </Link>
        ))}
        {!brains.length && (
          <p className="text-slate-500">
            Aucun Brain. Lance un enregistrement ou charge la démo pour générer un Brain complet
            (reporting Supabase, relances budget, graphe d&apos;outils).
          </p>
        )}
      </div>
    </div>
  );
}
