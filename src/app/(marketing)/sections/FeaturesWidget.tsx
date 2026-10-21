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
  const common = { className: "h-24 w-full max-w-xs mx-auto" };
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

const N = features.length;
const cx = 260;
const cy = 260;
const R = 250; // rayon extérieur
const R_IN = 110; // rayon intérieur (trou central)

function polar(r: number, deg: number): [number, number] {
  const rad = ((deg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
}

function wedgePath(i: number, spread = 0): string {
  // 6 segments équirépartis ; spread écarte légèrement le segment actif
  const step = 360 / N;
  const start = i * step + 1 + spread;
  const end = (i + 1) * step - 1 - spread;
  const [x1, y1] = polar(R, start);
  const [x2, y2] = polar(R, end);
  const [x3, y3] = polar(R_IN, end);
  const [x4, y4] = polar(R_IN, start);
  return `M ${x1} ${y1} A ${R} ${R} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${R_IN} ${R_IN} 0 0 0 ${x4} ${y4} Z`;
}

function labelPos(i: number): [number, number] {
  const step = 360 / N;
  const mid = (i + 0.5) * step;
  const [x, y] = polar((R + R_IN) / 2, mid);
  return [x, y];
}

export default function FeaturesWidget() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-center lg:justify-center">
      {/* La roue */}
      <div className="relative h-[520px] w-[520px] max-w-full shrink-0">
        <svg viewBox="0 0 520 520" className="h-full w-full">
          {/* fond de roue */}
          <circle cx={cx} cy={cy} r={R + 6} fill="#292524" opacity="0.08" />

          {features.map((f, i) => {
            const isActive = active === i;
            return (
              <g
                key={f.title}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                style={{ cursor: "pointer" }}
              >
                {/* segment */}
                <path
                  d={wedgePath(i, isActive ? 1.5 : 0)}
                  fill={isActive ? "#ff5c00" : "#1f1c18"}
                  stroke={isActive ? "#292524" : "#e5dccb"}
                  strokeWidth={2}
                  style={{
                    transition: "all 0.25s cubic-bezier(0.22,1,0.36,1)",
                    transform: isActive ? "scale(1.04)" : "scale(1)",
                    transformOrigin: "260px 260px",
                  }}
                />
                {/* numéro pixel */}
                {[...Array(4)].map((_, k) => {
                  const [lx, ly] = labelPos(i);
                  return k === 0 ? (
                    <text
                      key={k}
                      x={lx}
                      y={ly}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill={isActive ? "#fffdf8" : "#ff5c00"}
                      fontSize={22}
                      fontWeight="bold"
                      style={{ pointerEvents: "none" }}
                    >
                      {`0${i + 1}`}
                    </text>
                  ) : null;
                })}
              </g>
            );
          })}

          {/* centre */}
          <circle
            cx={cx}
            cy={cy}
            r={R_IN - 14}
            fill="#1f1c18"
            stroke="#ff5c00"
            strokeWidth={3}
          />
          <text
            x={cx}
            y={cy - 14}
            textAnchor="middle"
            fill="#fffdf8"
            fontSize={30}
            fontWeight="bold"
            style={{ pointerEvents: "none" }}
          >
            Omi
          </text>
          <text
            x={cx}
            y={cy + 16}
            textAnchor="middle"
            fill="#ff5c00"
            fontSize={11}
            fontWeight="bold"
            style={{ pointerEvents: "none", letterSpacing: 2 }}
          >
            FONCTIONNALITÉS
          </text>
          {active !== null && (
            <text
              x={cx}
              y={cy + 42}
              textAnchor="middle"
              fill="#b3a89a"
              fontSize={10}
              style={{ pointerEvents: "none" }}
            >
              {features[active].title}
            </text>
          )}
        </svg>
      </div>

      {/* Panneau de détail à droite */}
      <div className="w-full max-w-md">
        <div className="widget border-2 border-line bg-paper-raised p-6 shadow-[4px_4px_0_0_var(--line)]">
          {active === null ? (
            <p className="py-10 text-center text-sm text-muted">
              Survolez un segment de la roue pour découvrir la fonctionnalité.
            </p>
          ) : (
            <div key={active} className="st-item" style={{ animation: "none" }}>
              <Visual kind={features[active].visual} />
              <p className="mt-2 text-xs font-bold text-accent">
                {`0${active + 1} / 0${N}`}
              </p>
              <h3 className="mt-1 text-lg font-bold leading-snug text-text-strong">
                {features[active].title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-foreground">
                {features[active].text}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
