"use client";

import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "obi_intro_seen";

// Dégradé logique : chaque colonne de carrés a sa teinte, dans un ordre fixe
const GRADIENT = ["#ffd166", "#ffb347", "#ff9425", "#ff7a1a", "#ff5c00", "#f04a00", "#e63b0f"];

export default function IntroCurtain() {
  const [visible, setVisible] = useState(false);
  const [lifting, setLifting] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (sessionStorage.getItem(STORAGE_KEY)) return;
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
    sessionStorage.setItem(STORAGE_KEY, "1");
    setLifting(true);
    setTimeout(() => setVisible(false), 950);
  }

  function onGridMove(e: React.MouseEvent) {
    const grid = gridRef.current;
    if (!grid) return;
    const el = document.elementFromPoint(e.clientX, e.clientY);
    const cell = el?.closest("[data-intro-cell]");
    if (cell) colorize(cell as HTMLElement);
  }

  function colorize(cell: HTMLElement) {
    if (cell.dataset.animating === "1") return;
    cell.dataset.animating = "1";
    // Couleur par dégradé : selon la position horizontale du carré
    const rect = cell.getBoundingClientRect();
    const gx = (rect.left + rect.width / 2) / window.innerWidth;
    const idx = Math.min(
      GRADIENT.length - 1,
      Math.floor(gx * GRADIENT.length),
    );
    cell.style.background = GRADIENT[idx];
    setTimeout(() => {
      cell.style.background = "";
      cell.dataset.animating = "0";
    }, 600);
  }

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[200] overflow-hidden"
      style={{
        transition: "transform 0.9s cubic-bezier(0.76, 0, 0.24, 1)",
        transform: lifting ? "translateY(-100%)" : "translateY(0)",
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
          cursor: "auto",
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
        className="relative z-10 flex h-full items-center justify-center"
        onClick={lift}
        style={{ cursor: "auto" }}
      >
        <button
          onClick={lift}
          className="select-none px-16 py-10 text-center"
          style={{
            transition: "transform 0.9s cubic-bezier(0.76, 0, 0.24, 1)",
            transform: lifting ? "translateY(-70vh) scale(0.4)" : "translateY(0) scale(1)",
          }}
        >
          <span className="rounded-none border-2 border-ink bg-accent px-3 py-1.5 text-5xl font-bold text-background shadow-[4px_4px_0_0_var(--ink)] md:px-4 md:py-2 md:text-6xl">
            Obi
          </span>
          <span className="mt-3 block text-xs font-medium uppercase tracking-[0.4em] text-white/80">
            Onboarding Intelligence
          </span>
          <span className="mt-8 block text-xs text-white/60">Cliquer pour entrer</span>
        </button>
      </div>
    </div>
  );
}
