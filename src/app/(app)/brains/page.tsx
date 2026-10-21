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
          <h1 className="text-3xl font-bold text-text-strong">Job Brains</h1>
          <p className="mt-1 text-muted">Bases de connaissances vectorielles par poste, pôle ou projet.</p>
        </div>
        <Link
          href="/recorder"
          className="rounded-none bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-bright"
        >
          Créer un Brain
        </Link>
      </div>

      {error && (
        <p className="text-muted">
          Impossible de charger les Brains. Reconnectez-vous.
        </p>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {brains.map((b) => (
          <Link
            key={b.id}
            href={`/brains/${b.id}`}
            className="rounded-none border border-line bg-paper-raised p-5 hover:border-accent"
          >
            <div className="text-lg font-semibold text-text-strong">{b.name}</div>
            <div className="mt-1 text-sm text-muted">{b.owner || "Sans propriétaire"}</div>
            <span className="mt-3 inline-block rounded-none bg-accent-soft px-2 py-0.5 text-xs text-accent-bright">
              {b.scope}
            </span>
          </Link>
        ))}
        {!error && !brains.length && (
          <p className="text-muted">
            Aucun Brain pour l&apos;instant. Lancez un enregistrement depuis le Recorder :
            Obi transcrira, découpera en SOP et indexera tout dans le Brain de votre poste.
          </p>
        )}
      </div>
    </div>
  );
}
