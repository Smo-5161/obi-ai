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
        <h1 className="text-3xl font-bold text-text-strong">Omi Analytics</h1>
        <p className="mt-1 text-muted">
          Matrice de couverture des processus, vitesse de prise en main et points de blocage.
        </p>
      </div>

      {!reports.length && <p className="text-muted">Aucune donnée. Charge la démo depuis la page Brains.</p>}

      <div className="grid gap-6 md:grid-cols-2">
        {reports.map((r) => (
          <div key={r.brainId} className="space-y-4 rounded-none border border-line bg-paper-raised p-6">
            <h2 className="text-lg font-semibold text-text-strong">{r.name}</h2>
            <Bar label="Omi Coverage Score" value={r.coverageScore} color="bg-accent" />
            <Bar label="Onboarding Velocity" value={r.onboardingVelocityPercent} color="bg-emerald-600" />
            <Bar
              label="Tâches quotidiennes capturées"
              value={r.dailySharePercent}
              color="bg-accent"
            />
            <Bar
              label="Tâches hebdomadaires capturées"
              value={r.weeklySharePercent}
              color="bg-accent"
            />
            <div className="grid grid-cols-3 gap-2 text-center text-sm">
              <Stat label="SOP" value={r.sopCount} />
              <Stat label="Enregistrements" value={r.recordingCount} />
              <Stat label="PII masquées" value={r.maskedItems} />
            </div>
            <div>
              <h3 className="text-sm font-medium text-foreground">Questions posées à Omi : {r.askedQuestions}</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {Object.entries(r.blockingTopics)
                  .sort((a, b) => b[1] - a[1])
                  .map(([topic, n]) => (
                    <span key={topic} className="rounded-none bg-red-950/60 px-3 py-1 text-xs text-red-300">
                      {topic} ×{n}
                    </span>
                  ))}
                {!Object.keys(r.blockingTopics).length && (
                  <span className="text-xs text-muted">Aucun point de blocage détecté.</span>
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
      <div className="flex justify-between text-sm text-foreground">
        <span>{label}</span>
        <span className="font-medium">{value}%</span>
      </div>
      <div className="mt-1 h-2 rounded-none bg-background">
        <div className={`h-2 rounded-none ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-none bg-background p-2">
      <div className="text-lg font-bold text-text-strong">{value}</div>
      <div className="text-xs text-muted">{label}</div>
    </div>
  );
}
