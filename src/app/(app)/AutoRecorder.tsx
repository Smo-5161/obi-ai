"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface ActionLog {
  timestamp: number;
  type: "click" | "input" | "navigate" | "shortcut";
  app?: string;
  target?: string;
  url?: string;
  text?: string;
}

const SESSION_IDLE_MS = 120_000; // 2 min sans activité => la session est finalisée automatiquement
const MAX_EVENTS = 5000;

export default function AutoRecorder() {
  const [active, setActive] = useState(false);
  const [count, setCount] = useState(0);
  const [finalizing, setFinalizing] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const eventsRef = useRef<unknown[]>([]);
  const startTs = useRef<number>(0);
  const lastActivity = useRef<number>(0);
  const autoTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  // Détection des événements type Clarity : les mutations DOM + clics + saisies
  useEffect(() => {
    let cleanup = () => {};
    let mounted = true;

    import("rrweb").then(({ record }) => {
      if (!mounted) return;
      const stop = record({
        emit(event) {
          lastActivity.current = Date.now();
          eventsRef.current.push(event);
          if (eventsRef.current.length > MAX_EVENTS) {
            eventsRef.current.splice(0, eventsRef.current.length - MAX_EVENTS);
          }
          setCount(eventsRef.current.length);
          if (eventsRef.current.length > 20) setActive(true);
        },
        maskAllInputs: false,
      });
      startTs.current = Date.now();
      lastActivity.current = Date.now();
      cleanup = () => stop?.();
    });

    return () => {
      mounted = false;
      cleanup();
    };
  }, []);

  const finalize = useCallback(async () => {
    setFinalizing(true);
    setMsg(null);
    try {
      const events = eventsRef.current;
      // durée plafonnée : le temps réellement actif ne dépasse pas la fenêtre d'accumulation.
      // On cap pour éviter qu'une page ouverte des heures n'explose le quota du plan.
      const rawDurationSec = Math.round((Date.now() - startTs.current) / 1000);
      const durationSec = Math.min(Math.max(60, rawDurationSec), 1800);

      // convertir les events en actions exploitables (comme le recorder manuel)
      const actions: ActionLog[] = [];
      const base = events.length ? (events[0] as { timestamp: number }).timestamp : Date.now();
      for (const ev of events as { type: number; data?: { source?: number; type?: number; id?: number; text?: string; href?: string }; timestamp: number }[]) {
        if (ev.type === 3 && ev.data) {
          const ts = ev.timestamp - base;
          if (ev.data.source === 2 && ev.data.type === 2) {
            actions.push({ timestamp: ts, type: "click", app: "Navigateur", target: `élément #${ev.data.id}` });
          } else if (ev.data.source === 5 && ev.data.text) {
            actions.push({ timestamp: ts, type: "input", app: "Navigateur", target: `élément #${ev.data.id}`, text: ev.data.text.slice(0, 120) });
          } else if (ev.data.source === 0 && ev.data.href) {
            actions.push({ timestamp: ts, type: "navigate", app: "Navigateur", url: ev.data.href });
          }
        }
      }

      if (actions.length < 3) {
        setMsg("Pas assez d'activité pour créer une SOP. Continuez à travailler puis réessayez.");
        setFinalizing(false);
        return;
      }

      // retrouver le brain du poste de l'utilisateur
      const brains = await fetch("/api/brains").then((r) => (r.ok ? r.json() : []));
      const brain = brains[0];
      if (!brain) {
        setMsg("Aucun Brain : créez votre poste d'abord.");
        setFinalizing(false);
        return;
      }

      const res = await fetch("/api/recordings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brainId: brain.id,
          title: `Session du ${new Date().toLocaleDateString("fr-FR")}`,
          durationSec,
          transcript: [
            {
              start: 0,
              end: 10,
              text: "Session de travail enregistrée automatiquement par Omi (capture d'activité continue).",
            },
          ],
          actionLogs: actions.slice(-400),
        }),
      });

      if (res.ok) {
        const rec = await res.json();
        setMsg(`Session ingérée automatiquement : ${rec.sops?.length ?? 0} SOP, connaissance mise à jour.`);
        eventsRef.current = [];
        setCount(0);
        setActive(false);
        startTs.current = Date.now();
      lastActivity.current = Date.now();
      } else {
        const errBody = await res.json().catch(() => ({}));
        setMsg(`Échec de l'ingestion : ${errBody.error ?? res.status}`);
      }
    } finally {
      setFinalizing(false);
    }
  }, []);

  // finalisation automatique dès 2 min d'inactivité
  useEffect(() => {
    autoTimer.current = setInterval(() => {
      if (
        eventsRef.current.length >= 30 &&
        Date.now() - lastActivity.current > SESSION_IDLE_MS
      ) {
        void finalize();
      }
    }, 15_000);
    return () => {
      if (autoTimer.current) clearInterval(autoTimer.current);
    };
  }, [finalize]);

  if (count < 20 && !msg) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 select-none rounded-none border-2 border-ink bg-paper-raised p-3 text-xs shadow-[3px_3px_0_0_var(--ink)]">
      <div className="flex items-center gap-3">
        <span className={`inline-block h-2.5 w-2.5 border border-ink ${active ? "bg-accent" : "bg-muted"}`} />
        <span className="font-bold text-text-strong">
          {active ? `Capture continue — ${count} événements` : "Capture en veille"}
        </span>
        <button
          onClick={finalize}
          disabled={finalizing || count < 20}
          className="border-2 border-ink bg-accent px-2 py-1 font-bold text-background disabled:opacity-40"
          title="Forcer la finalisation (sinon automatique après 2 min de pause)"
        >
          {finalizing ? "Analyse…" : "Finaliser maintenant"}
        </button>
      </div>
      {msg && <p className="mt-2 max-w-64 text-muted">{msg}</p>}
    </div>
  );
}
