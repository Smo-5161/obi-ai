"use client";

import { useState } from "react";

const features = [
  {
    title: "Capture multi-modale",
    text: "Écran, voix et actions enregistrés simultanément, en continu. Transcription automatique et détection des applications utilisées.",
    visual: "capture",
  },
  {
    title: "Job Brain vectoriel",
    text: "Une base de connaissances par fiche de poste : SOP structurées, projets en cours, points d'attention, recherche sémantique.",
    visual: "brain",
  },
  {
    title: "Masquage des données sensibles",
    text: "Les PII, identifiants et données financières sont détectés et masqués avant toute indexation, dès la capture.",
    visual: "shield",
  },
  {
    title: "Copilote d'onboarding",
    text: "L'agent Omi répond aux questions du nouvel arrivant en citant les extraits sources. Plus besoin de déranger les équipes en place.",
    visual: "chat",
  },
  {
    title: "Mémoire qui se met à jour",
    text: "Reconnaissance automatique des connaissances déjà enregistrées : Omi enrichit la mémoire au lieu de créer des doublons.",
    visual: "sync",
  },
  {
    title: "Zéro intervention humaine",
    text: "La transmission ne dépend plus de la disponibilité du prédécesseur : la connaissance est capturée en continu, disponible immédiatement.",
    visual: "zero",
  },
];

function Visual({ kind, active }: { kind: string; active: boolean }) {
  const A = "#ff5c00";
  const D = "#292524";
  const L = "#ffd9b3";
  const common = { className: "h-24 w-full max-w-[220px] mx-auto" };
  switch (kind) {
    case "capture":
      return (
        <svg {...common} viewBox="0 0 200 80" style={{ imageRendering: "pixelated" }}>
          <rect x="10" y="10" width="180" height="60" fill="none" stroke={A} strokeWidth="3" />
          <rect x="18" y="18" width="60" height="44" fill={L} />
          <rect x="86" y="18" width="30" height="8" fill={D} />
          <rect x="86" y="30" width="90" height="4" fill={A} className={active ? "fx-scroll" : undefined} />
          <rect x="86" y="38" width="70" height="4" fill={D} opacity="0.5" className={active ? "fx-scroll" : undefined} style={{ animationDelay: "0.3s" }} />
          <rect x="86" y="46" width="80" height="4" fill={A} opacity="0.7" className={active ? "fx-scroll" : undefined} style={{ animationDelay: "0.6s" }} />
          <rect x="86" y="54" width="50" height="4" fill={D} opacity="0.5" className={active ? "fx-scroll" : undefined} style={{ animationDelay: "0.9s" }} />
          <circle cx="170" cy="60" r="5" fill={A} className={active ? "fx-blink" : undefined} />
        </svg>
      );
    case "brain":
      return (
        <svg {...common} viewBox="0 0 200 80" style={{ imageRendering: "pixelated" }}>
          {[0,1,2,3,4,5].map(i => (
            <rect
              key={i}
              x={20 + i*26}
              y={i%2===0 ? 14 : 10}
              width="14"
              height={i%2===0 ? 52 : 60}
              fill={i%3===0 ? D : A}
              opacity={i%2 ? 0.25 : 0.9}
              className={active ? "fx-pulse" : undefined}
              style={{ animationDelay: `${i * 0.18}s` }}
            />
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
          <rect x="68" y="18" width="64" height="30" fill={A} className={active ? "fx-glow" : undefined} />
          <rect x="74" y="48" width="52" height="12" fill="#c24800" />
          <rect x="86" y="60" width="28" height="8" fill="#c24800" />
          <rect x="92" y="26" width="16" height="6" fill="#14120f" className={active ? "fx-scan" : undefined} />
          <rect x="88" y="36" width="24" height="4" fill="#14120f" className={active ? "fx-scan" : undefined} style={{ animationDelay: "0.25s" }} />
          <rect x="20" y="30" width="30" height="6" fill={D} opacity="0.3" />
          <rect x="150" y="30" width="30" height="6" fill={D} opacity="0.3" />
        </svg>
      );
    case "chat":
      return (
        <svg {...common} viewBox="0 0 200 80" style={{ imageRendering: "pixelated" }}>
          <g className={active ? "fx-pop" : undefined}>
            <rect x="16" y="10" width="90" height="26" fill={L} />
            <rect x="22" y="16" width="60" height="4" fill={D} opacity="0.6" />
            <rect x="22" y="24" width="70" height="4" fill={D} opacity="0.4" />
          </g>
          <g className={active ? "fx-pop" : undefined} style={{ animationDelay: "0.45s" }}>
            <rect x="94" y="42" width="90" height="26" fill={A} />
            <rect x="100" y="48" width="60" height="4" fill="#14120f" opacity="0.8" />
            <rect x="100" y="56" width="40" height="4" fill="#14120f" opacity="0.5" />
          </g>
          <rect x="150" y="14" width="24" height="6" fill={A} opacity="0.4" className={active ? "fx-blink" : undefined} />
        </svg>
      );
    case "sync":
      return (
        <svg {...common} viewBox="0 0 200 80" style={{ imageRendering: "pixelated" }}>
          <rect x="30" y="26" width="50" height="28" fill="none" stroke={A} strokeWidth="3" />
          <rect x="120" y="26" width="50" height="28" fill={A} />
          <rect x="85" y="36" width="30" height="6" fill={D} className={active ? "fx-flow" : undefined} />
          <polygon points="85,33 85,45 76,39" fill={D} className={active ? "fx-blink" : undefined} />
          <polygon points="115,33 115,45 124,39" fill={A} className={active ? "fx-blink" : undefined} style={{ animationDelay: "0.4s" }} />
          <rect x="42" y="34" width="26" height="4" fill={D} opacity="0.5" className={active ? "fx-scroll" : undefined} />
          <rect x="132" y="34" width="26" height="4" fill="#14120f" opacity="0.7" className={active ? "fx-scroll" : undefined} style={{ animationDelay: "0.5s" }} />
        </svg>
      );
    default:
      return (
        <svg {...common} viewBox="0 0 200 80" style={{ imageRendering: "pixelated" }}>
          <circle cx="100" cy="40" r="18" fill="none" stroke={A} strokeWidth="4" />
          <g className={active ? "fx-spin" : undefined} style={{ transformOrigin: "100px 40px" }}>
            <rect x="96" y="28" width="8" height="16" fill={A} />
          </g>
          <rect x="150" y="20" width="12" height="12" fill={D} opacity="0.4" className={active ? "fx-blink" : undefined} />
          <rect x="40" y="50" width="10" height="10" fill={A} opacity="0.4" className={active ? "fx-blink" : undefined} style={{ animationDelay: "0.3s" }} />
        </svg>
      );
  }
}

export default function FeatureCards() {
  return (
    <div className="mt-12">
      <h3 className="st-item text-xl font-bold tracking-tight text-text-strong">
        Fonctionnalités
      </h3>
      <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {features.map((f, i) => (
          <FeatureCard key={f.title} feature={f} index={i} />
        ))}
      </div>
    </div>
  );
}

function FeatureCard({
  feature: f,
  index: i,
}: {
  feature: (typeof features)[number];
  index: number;
}) {
  const [hover, setHover] = useState(false);
  return (
    <article
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="widget st-item border-2 border-line bg-paper-raised p-5 shadow-[4px_4px_0_0_var(--line)]"
    >
      <div className="flex items-center justify-between">
        <Visual kind={f.visual} active={hover} />
        <span className="shrink-0 self-start text-xs font-bold text-accent">
          {`0${i + 1}`}
        </span>
      </div>
      <h4 className="mt-3 text-sm font-bold leading-snug text-text-strong">
        {f.title}
      </h4>
      <p className="mt-2 text-xs leading-relaxed text-foreground">{f.text}</p>
    </article>
  );
}
