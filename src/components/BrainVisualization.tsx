"use client";

import { useState } from "react";

export type BrainVisualKind = "process" | "session" | "insight" | "dependency" | "knowledge";

export interface BrainVisualItem {
  id: string;
  title: string;
  description: string;
  kind: BrainVisualKind;
}

const kindLabels: Record<BrainVisualKind, string> = {
  process: "Processus / SOP",
  session: "Session",
  insight: "Connaissance",
  dependency: "Outil ou contact",
  knowledge: "Note manuelle",
};

const kindClasses: Record<BrainVisualKind, string> = {
  process: "brain-kind--process",
  session: "brain-kind--session",
  insight: "brain-kind--insight",
  dependency: "brain-kind--dependency",
  knowledge: "brain-kind--knowledge",
};

export default function BrainVisualization({ items }: { items: BrainVisualItem[] }) {
  const visibleItems = items.slice(0, 22);
  const [selectedId, setSelectedId] = useState(visibleItems[0]?.id ?? "");
  const selected = visibleItems.find((item) => item.id === selectedId) ?? visibleItems[0];
  const center = { x: 450, y: 265 };
  const positioned = visibleItems.map((item, index) => {
    const angle = (index * 2.39996) - Math.PI / 2;
    const radius = 92 + (index % 3) * 61;
    return {
      item,
      x: center.x + Math.cos(angle) * radius * 1.48,
      y: center.y + Math.sin(angle) * radius * .94,
    };
  });

  return (
    <section className="brain-visualization" aria-label="Visualisation du réseau de connaissances">
      <div className="brain-visualization__heading">
        <div>
          <p className="brain-visualization__eyebrow">CARTE DES CONNAISSANCES</p>
          <h2>Le Brain, en réseau</h2>
          <p>Chaque nœud représente une information reliée au contexte du poste.</p>
        </div>
        <span className="brain-visualization__count">{items.length} éléments</span>
      </div>

      <div className="brain-visualization__canvas">
        <svg viewBox="0 0 900 530" role="group" aria-label="Réseau interactif du Brain">
          <defs>
            <radialGradient id="brain-core-glow">
              <stop offset="0%" stopColor="#aeb9e6" stopOpacity=".25" />
              <stop offset="100%" stopColor="#aeb9e6" stopOpacity="0" />
            </radialGradient>
          </defs>
          <ellipse className="brain-orbit brain-orbit--outer" cx={center.x} cy={center.y} rx="282" ry="205" />
          <ellipse className="brain-orbit brain-orbit--inner" cx={center.x} cy={center.y} rx="188" ry="137" />
          {positioned.map(({ item, x, y }, index) => (
            <g key={"edge-" + item.id}>
              <line className={"brain-synapse " + kindClasses[item.kind]} x1={center.x} y1={center.y} x2={x} y2={y} />
              {index > 0 && index % 3 === 0 ? (
                <line
                  className="brain-synapse brain-synapse--secondary"
                  x1={positioned[index - 1].x}
                  y1={positioned[index - 1].y}
                  x2={x}
                  y2={y}
                />
              ) : null}
            </g>
          ))}
          <circle className="brain-core-glow" cx={center.x} cy={center.y} r="85" fill="url(#brain-core-glow)" />
          <circle className="brain-core-ring" cx={center.x} cy={center.y} r="43" />
          <circle className="brain-core" cx={center.x} cy={center.y} r="24" />
          <text className="brain-core-label" x={center.x} y={center.y + 63} textAnchor="middle">BRAIN</text>
          {positioned.map(({ item, x, y }) => (
            <g
              key={item.id}
              className={"brain-neuron " + kindClasses[item.kind] + (item.id === selected?.id ? " is-selected" : "")}
              role="button"
              tabIndex={0}
              aria-label={kindLabels[item.kind] + " : " + item.title}
              aria-pressed={item.id === selected?.id}
              onClick={() => setSelectedId(item.id)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setSelectedId(item.id);
                }
              }}
            >
              <title>{item.title}</title>
              <circle className="brain-neuron-halo" cx={x} cy={y} r="16" />
              <circle className="brain-neuron-dot" cx={x} cy={y} r="6" />
            </g>
          ))}
        </svg>
        {!visibleItems.length && (
          <p className="brain-visualization__empty">Les informations ajoutées apparaîtront ici sous forme de réseau.</p>
        )}
      </div>

      <div className="brain-visualization__legend" aria-label="Types de données">
        {(Object.keys(kindLabels) as BrainVisualKind[]).map((kind) => (
          <span key={kind} className={"brain-legend " + kindClasses[kind]}>
            <i />
            {kindLabels[kind]}
          </span>
        ))}
      </div>

      {selected && (
        <div className="brain-visualization__selection" aria-live="polite">
          <span className={"brain-visualization__selection-kind " + kindClasses[selected.kind]}>
            {kindLabels[selected.kind]}
          </span>
          <strong>{selected.title}</strong>
          <p>{selected.description}</p>
        </div>
      )}
    </section>
  );
}
