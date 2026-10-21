"use client";

import { useState, useRef, useCallback } from "react";

const slides = [
  {
    title: "Capture multi-modale",
    text: "Écran, voix et actions enregistrés simultanément. Transcription automatique haute précision et détection des applications utilisées.",
    visual: "capture",
  },
  {
    title: "Job Brain vectoriel",
    text: "Une base de connaissances par fiche de poste : SOP structurées, graphe d'outils et de contacts clés, recherche sémantique.",
    visual: "brain",
  },
  {
    title: "Masquage des données sensibles",
    text: "Les PII, identifiants et données financières sont détectés et masqués avant toute indexation, dès la capture.",
    visual: "shield",
  },
  {
    title: "Copilote d'onboarding",
    text: "Guidage pas à pas avec références aux extraits sources. Le nouvel arrivant progresse sans mobiliser les équipes en place.",
    visual: "chat",
  },
  {
    title: "Dashboard de transition",
    text: "Taux de couverture du poste, vitesse d'onboarding et analyse des points de blocage récurrents, pour les managers et les RH.",
    visual: "dashboard",
  },
  {
    title: "Zéro intervention humaine",
    text: "La transmission ne dépend plus de la disponibilité du prédécesseur : la connaissance est capturée en continu, disponible immériatement.",
    visual: "zero",
  },
];

function Visual({ kind }: { kind: string }) {
  const A = "#ff5c00";
  const D = "#292524";
  const L = "#ffd9b3";
  const common = { className: "h-32 w-full max-w-xs mx-auto" };
  switch (kind) {
    case "capture":
      return (
        <svg {...common} viewBox="0 0 200 80" style={{ imageRendering: "pixelated" }}>
          <rect x="10" y="10" width="180" height="60" fill="none" stroke={A} strokeWidth="3" />
          <rect x="18" y="18" width="60" height="44" fill={L} />
          <rect x="86" y="18" width="30" height="8" fill={D} />
          <rect x="86" y="30" width="90" height="4" fill={A} />
          <rect x="86" y="38" width="70" height="4" fill={D} opacity="0.5" />
          <rect x="86" y="46" width="80" height="4" fill={A} opacity="0.7" />
          <rect x="86" y="54" width="50" height="4" fill={D} opacity="0.5" />
          <circle cx="170" cy="60" r="5" fill={A} />
        </svg>
      );
    case "brain":
      return (
        <svg {...common} viewBox="0 0 200 80" style={{ imageRendering: "pixelated" }}>
          {[0,1,2,3,4,5].map(i => (
            <rect key={i} x={20 + i*26} y={i%2===0 ? 14 : 10} width="14" height={i%2===0 ? 52 : 60} fill={i%3===0 ? D : A} opacity={i%2 ? 0.25 : 0.9} />
          ))}
          {[0,1,2,3,4,5,6].map(i => (
            <rect key={i} x={34 + i*18} y="10" width="3" height="60" fill={L} opacity="0.6" />
          ))}
        </svg>
      );
    case "shield":
      return (
        <svg {...common} viewBox="0 0 200 80" style={{ imageRendering: "pixelated" }}>
          <rect x="80" y="8" width="40" height="10" fill={A} />
          <rect x="68" y="18" width="64" height="30" fill={A} />
          <rect x="74" y="48" width="52" height="12" fill="#c24800" />
          <rect x="86" y="60" width="28" height="8" fill="#c24800" />
          <rect x="92" y="26" width="16" height="6" fill="#14120f" />
          <rect x="88" y="36" width="24" height="4" fill="#14120f" />
          <rect x="20" y="30" width="30" height="6" fill={D} opacity="0.3" />
          <rect x="150" y="30" width="30" height="6" fill={D} opacity="0.3" />
        </svg>
      );
    case "chat":
      return (
        <svg {...common} viewBox="0 0 200 80" style={{ imageRendering: "pixelated" }}>
          <rect x="16" y="10" width="90" height="26" fill={L} />
          <rect x="22" y="16" width="60" height="4" fill={D} opacity="0.6" />
          <rect x="22" y="24" width="70" height="4" fill={D} opacity="0.4" />
          <rect x="94" y="42" width="90" height="26" fill={A} />
          <rect x="100" y="48" width="60" height="4" fill="#14120f" opacity="0.8" />
          <rect x="100" y="56" width="40" height="4" fill="#14120f" opacity="0.5" />
          <rect x="150" y="14" width="24" height="6" fill={A} opacity="0.4" />
        </svg>
      );
    case "dashboard":
      return (
        <svg {...common} viewBox="0 0 200 80" style={{ imageRendering: "pixelated" }}>
          <rect x="16" y="10" width="168" height="60" fill="none" stroke={A} strokeWidth="3" />
          <rect x="30" y="40" width="14" height="20" fill={A} />
          <rect x="54" y="30" width="14" height="30" fill={D} />
          <rect x="78" y="20" width="14" height="40" fill={A} />
          <rect x="102" y="46" width="14" height="14" fill="#c24800" />
          <rect x="126" y="36" width="14" height="24" fill={D} />
          <rect x="150" y="26" width="14" height="34" fill={A} />
        </svg>
      );
    default:
      return (
        <svg {...common} viewBox="0 0 200 80" style={{ imageRendering: "pixelated" }}>
          <circle cx="100" cy="40" r="18" fill="none" stroke={A} strokeWidth="4" />
          <rect x="96" y="28" width="8" height="16" fill={A} />
          <rect x="150" y="20" width="12" height="12" fill={D} opacity="0.4" />
          <rect x="40" y="50" width="10" height="10" fill={A} opacity="0.4" />
        </svg>
      );
  }
}

const LOOP_PADDING = 2;

export default function FeaturesCarousel() {
  const [index, setIndex] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [dragX, setDragX] = useState(0);
  const startX = useRef(0);

  const next = useCallback(() => setIndex((i) => (i + 1) % slides.length), []);
  const prev = useCallback(
    () => setIndex((i) => (i - 1 + slides.length) % slides.length),
    [],
  );

  function onPointerDown(e: React.PointerEvent) {
    setDragging(true);
    startX.current = e.clientX;
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!dragging) return;
    setDragX(e.clientX - startX.current);
  }
  function onPointerUp() {
    if (!dragging) return;
    if (dragX < -60) next();
    else if (dragX > 60) prev();
    setDragging(false);
    setDragX(0);
  }

  // Rail en boucle : on duplique les premières slides derrière les dernières
  const rail = [...slides, ...slides.slice(0, LOOP_PADDING)];

  return (
    <div
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      className="relative select-none touch-pan-y"
      style={{ cursor: dragging ? "grabbing" : "grab" }}
    >
      <div className="overflow-hidden border-2 border-line bg-background py-8 shadow-[4px_4px_0_0_var(--line)]">
        <div
          className="flex gap-5 px-5"
          style={{
            transform: `translateX(calc(${-index * (100 / slides.length)}% + ${dragX}px))`,
            transition: dragging
              ? "none"
              : "transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          {rail.map((slide, i) => (
            <div
              key={`${slide.title}-${i}`}
              className="w-[85%] shrink-0 border-2 border-line bg-paper-raised p-6 shadow-[4px_4px_0_0_var(--line)] md:w-[38%]"
            >
              <div className="grid items-center gap-4 md:grid-cols-2">
                <div>
                  <p className="text-xs font-bold text-accent">
                    {`0${(i % slides.length) + 1} / 0${slides.length}`}
                  </p>
                  <h3 className="mt-3 text-base font-bold leading-snug text-text-strong">{slide.title}</h3>
                  <p className="mt-3 text-xs leading-relaxed text-foreground md:text-sm">{slide.text}</p>
                </div>
                <div className="flex items-center justify-center">
                  <Visual kind={slide.visual} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Barre de slide unique */}
      <div className="mt-5 h-1.5 w-full border border-line bg-background" aria-hidden="true">
        <div
          className="h-full bg-accent"
          style={{
            width: `${((index + 1) / slides.length) * 100}%`,
            transition: "width 0.55s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        />
      </div>
    </div>
  );
}
