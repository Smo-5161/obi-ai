"use client";

import { useState, useRef } from "react";

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
    text: "La transmission ne dépend plus de la disponibilité du prédécesseur : la connaissance est capturée en continu, disponible immédiatement.",
    visual: "zero",
  },
];

function Visual({ kind }: { kind: string }) {
  const A = "#ff5c00";
  const D = "#292524";
  const L = "#ffd9b3";
  const common = { className: "h-40 w-full max-w-sm mx-auto" };
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

const N = slides.length;
const CLONES = N; // un jeu complet de clones pour une boucle invisible dans les deux sens

export default function FeaturesCarousel() {
  // index logique : peut sortir de [0, N) — on boucle via modulo à l'affichage
  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(true);
  const jumping = useRef(false);

  // Cartes rendues : clones + vraies + clones (3N cartes, la fenêtre montre la copie du milieu)
  const rail = [];
  for (let i = -CLONES; i < N + CLONES; i++) {
    rail.push({ ...slides[((i % N) + N) % N], key: i });
  }
  const offset = CLONES; // la carte "vraie" 0 est à la position CLONES dans le rail

  function goTo(newIndex: number) {
    setAnimate(true);
    setIndex(newIndex);
  }

  // Quand on dépasse les limites du rail physique, on saute sans transition vers la position équivalente
  function handleTransitionEnd() {
    if (jumping.current) {
      jumping.current = false;
      setAnimate(false);
      // recentrer dans la zone canonique [0, N)
      setIndex((i) => ((i % N) + N) % N);
    }
  }

  // détecter le dépassement : après la transition, si l'index est hors zone, on saute
  function next() {
    const target = index + 1;
    setAnimate(true);
    if (target >= N + CLONES - 1) jumping.current = true;
    setIndex(target);
  }
  function prev() {
    const target = index - 1;
    setAnimate(true);
    if (target <= -(CLONES - 1)) jumping.current = true;
    setIndex(target);
  }

  const cardWidth = 70; // vw — dominante
  const gap = 3; // vw
  const step = cardWidth + gap;

  return (
    <div className="relative w-full">
      <div
        className="w-screen overflow-hidden py-2"
        style={{ marginLeft: "calc(50% - 50vw)" }}
      >
        <div
          onTransitionEnd={handleTransitionEnd}
          className="flex"
          style={{
            gap: `${gap}vw`,
            transform: `translateX(calc(50vw - ${cardWidth / 2}vw - ${(offset + index) * step}vw))`,
            transition: animate
              ? "transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)"
              : "none",
          }}
        >
          {rail.map((slide) => (
            <div
              key={slide.key}
              className="shrink-0 border-2 border-line bg-paper-raised p-6 shadow-[4px_4px_0_0_var(--line)]"
              style={{ width: `${cardWidth}vw` }}
            >
              <div className="grid items-center gap-4 md:grid-cols-2">
                <div>
                  <p className="text-xs font-bold text-accent">
                    {`0${(((slide.key % N) + N) % N) + 1} / 0${N}`}
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

      {/* Contrôles : flèches latérales */}
      <button
        onClick={prev}
        aria-label="Fonctionnalité précédente"
        className="absolute left-2 top-1/2 z-10 -translate-y-1/2 border-2 border-ink bg-paper-raised px-3 py-2 font-bold text-text-strong shadow-[2px_2px_0_0_var(--ink)]"
      >
        ‹
      </button>
      <button
        onClick={next}
        aria-label="Fonctionnalité suivante"
        className="absolute right-2 top-1/2 z-10 -translate-y-1/2 border-2 border-ink bg-paper-raised px-3 py-2 font-bold text-text-strong shadow-[2px_2px_0_0_var(--ink)]"
      >
        ›
      </button>

      {/* Barre de progression unique */}
      <div className="mx-auto mt-5 h-1.5 w-full max-w-md border border-line bg-background" aria-hidden="true">
        <div
          className="h-full bg-accent"
          style={{
            width: `${(((((index % N) + N) % N) + 1) / N) * 100}%`,
            transition: "width 0.55s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        />
      </div>
    </div>
  );
}
