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
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/brains")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setBrains)
      .catch(() => setError(true));
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Job Brains</h1>
          <p className="mt-1 text-slate-400">Bases de connaissances vectorielles par poste, pôle ou projet.</p>
        </div>
        <Link
          href="/recorder"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
        >
          Créer un Brain
        </Link>
      </div>

      {error && (
        <p className="text-slate-400">
          Impossible de charger les Brains. Reconnectez-vous.
        </p>
      )}

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
        {!error && !brains.length && (
          <p className="text-slate-500">
            Aucun Brain pour l&apos;instant. Lancez un enregistrement depuis le Recorder :
            Obi transcrira, découpera en SOP et indexera tout dans le Brain de votre poste.
          </p>
        )}
      </div>
    </div>
  );
}
