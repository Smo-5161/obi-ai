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

function Visual({ kind }: { kind: string }) {
  const A = "#ff5c00";
  const D = "#292524";
  const L = "#ffd9b3";
  const common = { className: "h-16 w-full max-w-[180px] mx-auto" };
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
    case "sync":
      return (
        <svg {...common} viewBox="0 0 200 80" style={{ imageRendering: "pixelated" }}>
          <rect x="30" y="26" width="50" height="28" fill="none" stroke={A} strokeWidth="3" />
          <rect x="120" y="26" width="50" height="28" fill={A} />
          <rect x="85" y="36" width="30" height="6" fill={D} />
          <polygon points="85,33 85,45 76,39" fill={D} />
          <polygon points="115,33 115,45 124,39" fill={A} />
          <rect x="42" y="34" width="26" height="4" fill={D} opacity="0.5" />
          <rect x="132" y="34" width="26" height="4" fill="#14120f" opacity="0.7" />
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

// Clip hexagonal (pointe en haut) — utilisé pour que le contenu épouse la forme
const HEX_CLIP = "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)";

export default function FeaturesWidget() {
  const [active, setActive] = useState<number | null>(null);

  // disposition : hexagone central (Omi) + 6 hexagones autour (fleur hexagonale)
  // positions en % du conteneur (740x640)
  const spots = [
    { left: 50, top: 16.5 },  // haut
    { left: 76, top: 31 },    // haut-droite
    { left: 76, top: 69 },    // bas-droite
    { left: 50, top: 83.5 },  // bas
    { left: 24, top: 69 },    // bas-gauche
    { left: 24, top: 31 },    // haut-gauche
  ];

  return (
    <div className="flex flex-col items-center">
      <div className="relative mx-auto h-[640px] w-[740px] max-w-full">
        {features.map((f, i) => {
          const isActive = active === i;
          const dimmed = active !== null && !isActive;
          const spot = spots[i];
          return (
            <div
              key={f.title}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${spot.left}%`,
                top: `${spot.top}%`,
                width: 250,
                height: 230,
                zIndex: isActive ? 20 : dimmed ? 5 : 10,
                transition: "transform 0.35s cubic-bezier(0.34, 1.3, 0.64, 1), filter 0.3s ease, opacity 0.3s ease",
                transform: `translate(-50%, -50%) scale(${isActive ? 1.22 : 1})`,
                filter: dimmed ? "brightness(0.55) saturate(0.7)" : "none",
              }}
            >
              {/* l'hexagone */}
              <div
                className="flex h-full w-full flex-col items-center justify-center overflow-hidden border-2 px-6 text-center"
                style={{
                  clipPath: HEX_CLIP,
                  background: isActive ? "#ff5c00" : "#1f1c18",
                  borderColor: isActive ? "#292524" : "#e5dccb",
                  boxShadow: isActive
                    ? "0 0 0 6px rgba(255,92,0,0.25), 8px 8px 0 0 rgba(41,37,36,0.35)"
                    : "none",
                  transition: "background 0.3s ease",
                  cursor: "pointer",
                }}
              >
                {/* numéro pixel */}
                <span
                  className="text-xl font-bold"
                  style={{
                    color: isActive ? "#fffdf8" : "#ff5c00",
                    transition: "opacity 0.25s ease, color 0.25s ease",
                  }}
                >
                  {`0${i + 1}`}
                </span>

                {/* titre : visible au repos */}
                <span
                  className="mt-1 text-[13px] font-bold leading-tight"
                  style={{
                    color: isActive ? "#fffdf8" : "#fbf7f0",
                    maxWidth: 150,
                    opacity: isActive ? 0 : 1,
                    height: isActive ? 0 : undefined,
                    transition: "opacity 0.2s ease",
                    overflow: "hidden",
                  }}
                >
                  {f.title}
                </span>

                {/* contenu déployé quand actif */}
                <div
                  className="flex flex-col items-center justify-center"
                  style={{
                    position: "absolute",
                    inset: 0,
                    padding: "52px 34px 34px",
                    opacity: isActive ? 1 : 0,
                    transform: isActive ? "scale(1)" : "scale(0.9)",
                    transition: "opacity 0.3s ease 0.08s, transform 0.35s cubic-bezier(0.34,1.3,0.64,1)",
                    pointerEvents: "none",
                  }}
                >
                  <Visual kind={f.visual} />
                  <h3
                    className="mt-1 text-sm font-bold leading-tight text-background"
                    style={{ maxWidth: 190 }}
                  >
                    {f.title}
                  </h3>
                  <p className="mt-1 text-[11px] leading-snug text-background/90">
                    {f.text}
                  </p>
                </div>
              </div>
            </div>
          );
        })}

        {/* l'hexagone central : Omi */}
        <div
          className="absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2"
          style={{ width: 210, height: 195 }}
        >
          <div
            className="flex h-full w-full flex-col items-center justify-center border-2 border-accent"
            style={{
              clipPath: HEX_CLIP,
              background: "#1f1c18",
              boxShadow: "4px 4px 0 0 rgba(41,37,36,0.4)",
            }}
          >
            <span className="text-3xl font-bold text-paper">Omi</span>
            <span
              className="mt-1 text-[10px] font-bold uppercase tracking-[0.3em] text-accent"
            >
              Fonctionnalités
            </span>
            {active !== null && (
              <span
                className="mt-1 px-4 text-[10px] leading-snug text-muted"
                style={{ animation: "none" }}
              >
                {features[active].title}
              </span>
            )}
          </div>
        </div>
      </div>

      <p className="mt-2 text-center text-sm text-muted">
        Survolez un hexagone pour le déployer.
      </p>
    </div>
  );
}
