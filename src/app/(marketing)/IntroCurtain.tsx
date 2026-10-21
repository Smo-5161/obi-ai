"use client";

import { useEffect, useRef, useState } from "react";

// Dégradé logique : chaque carré s'illumine selon sa position horizontale
const GRADIENT = ["#ffd166", "#ffb347", "#ff9425", "#ff7a1a", "#ff5c00", "#f04a00", "#e63b0f"];

export default function IntroCurtain() {
  const [visible, setVisible] = useState(false);
  const [lifting, setLifting] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const lastCellRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.body.dataset.introDone = "1";
      return;
    }
    const t = setTimeout(() => setVisible(true), 0);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") lift();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible]);

  function lift() {
    if (lifting) return;
    setLifting(true);
    document.body.dataset.introDone = "1";
    setTimeout(() => setVisible(false), 1000);
  }

  function colorize(cell: HTMLElement) {
    if (cell.dataset.animating === "1") return;
    cell.dataset.animating = "1";
    const rect = cell.getBoundingClientRect();
    const gx = (rect.left + rect.width / 2) / window.innerWidth;
    const idx = Math.min(GRADIENT.length - 1, Math.floor(gx * GRADIENT.length));
    cell.style.backgroundColor = GRADIENT[idx];
    setTimeout(() => {
      cell.style.backgroundColor = "";
      cell.dataset.animating = "0";
    }, 600);
  }

  function onGridMove(e: React.MouseEvent) {
    const grid = gridRef.current;
    if (!grid) return;
    const els = document.elementsFromPoint(e.clientX, e.clientY);
    const cell = els.find((el) => (el as HTMLElement).dataset?.introCell !== undefined);
    if (cell && cell !== lastCellRef.current) {
      lastCellRef.current = cell as HTMLElement;
      colorize(cell as HTMLElement);
    }
  }

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[200] overflow-hidden"
      style={{
        transition: "transform 0.9s cubic-bezier(0.76, 0, 0.24, 1)",
        transform: lifting ? "translateY(-100%)" : "translateY(0)",
        pointerEvents: lifting ? "none" : "auto",
      }}
      aria-hidden="true"
    >
      <div
        ref={gridRef}
        onMouseMove={onGridMove}
        onClick={lift}
        className="absolute inset-0 grid"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(36px, 1fr))",
          gridAutoRows: "36px",
          background: "#ff5c00",
        }}
      >
        {Array.from({ length: 1600 }).map((_, i) => (
          <div
            key={i}
            data-intro-cell
            className="border border-[#e04e00]/40 transition-colors duration-200"
          />
        ))}
      </div>

      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <button
          onClick={lift}
          className="pointer-events-auto select-none px-16 py-10 text-center"
          style={{
            transition:
              "transform 0.85s cubic-bezier(0.55, 0, 0.9, 0.4), opacity 0.8s ease 0.1s",
            transform: lifting
              ? "translateY(-75vh) scale(0.35)"
              : "translateY(0) scale(1)",
            opacity: lifting ? 0.9 : 1,
          }}
        >
          <span className="inline-block rounded-none border-2 border-ink bg-accent px-3 py-1.5 text-5xl font-bold text-background shadow-[4px_4px_0_0_var(--ink)] md:px-4 md:py-2 md:text-6xl">
            Obi
          </span>
          <span className="mt-8 block text-xs text-white/60">Cliquer pour entrer</span>
        </button>
      </div>
    </div>
  );
}
