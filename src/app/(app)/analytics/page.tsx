"use client";

import { useEffect, useState } from "react";

interface Report {
  brainId: string;
  name: string;
  coverageScore: number;
  sopCount: number;
  recordingCount: number;
  maskedItems: number;
  frequencySplit: Record<string, number>;
  dailySharePercent: number;
  weeklySharePercent: number;
  onboardingVelocityPercent: number;
  askedQuestions: number;
  blockingTopics: Record<string, number>;
}

export default function AnalyticsPage() {
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    fetch("/api/analytics").then((r) => r.json()).then(setReports);
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-100">Obi Analytics</h1>
        <p className="mt-1 text-slate-400">
          Matrice de couverture des processus, vitesse de prise en main et points de blocage.
        </p>
      </div>

      {!reports.length && <p className="text-slate-500">Aucune donnée. Charge la démo depuis la page Brains.</p>}

      <div className="grid gap-6 md:grid-cols-2">
        {reports.map((r) => (
          <div key={r.brainId} className="space-y-4 rounded-xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-lg font-semibold text-slate-100">{r.name}</h2>
            <Bar label="Obi Coverage Score" value={r.coverageScore} color="bg-indigo-600" />
            <Bar label="Onboarding Velocity" value={r.onboardingVelocityPercent} color="bg-emerald-600" />
            <Bar
              label="Tâches quotidiennes capturées"
              value={r.dailySharePercent}
              color="bg-amber-600"
            />
            <Bar
              label="Tâches hebdomadaires capturées"
              value={r.weeklySharePercent}
              color="bg-teal-600"
            />
            <div className="grid grid-cols-3 gap-2 text-center text-sm">
              <Stat label="SOP" value={r.sopCount} />
              <Stat label="Enregistrements" value={r.recordingCount} />
              <Stat label="PII masquées" value={r.maskedItems} />
            </div>
            <div>
              <h3 className="text-sm font-medium text-slate-300">Questions posées à Obi : {r.askedQuestions}</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {Object.entries(r.blockingTopics)
                  .sort((a, b) => b[1] - a[1])
                  .map(([topic, n]) => (
                    <span key={topic} className="rounded-full bg-red-950/60 px-3 py-1 text-xs text-red-300">
                      {topic} ×{n}
                    </span>
                  ))}
                {!Object.keys(r.blockingTopics).length && (
                  <span className="text-xs text-slate-500">Aucun point de blocage détecté.</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Bar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-sm text-slate-300">
        <span>{label}</span>
        <span className="font-medium">{value}%</span>
      </div>
      <div className="mt-1 h-2 rounded-full bg-slate-800">
        <div className={`h-2 rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-slate-800 p-2">
      <div className="text-lg font-bold text-slate-100">{value}</div>
      <div className="text-xs text-slate-400">{label}</div>
    </div>
  );
}
