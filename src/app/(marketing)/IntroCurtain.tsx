"use client";

import { useEffect, useRef, useState } from "react";

const PALETTE = ["#ffb347", "#ff5c00", "#e63b0f", "#ffd166", "#ff7a1a"];

const STORAGE_KEY = "obi_intro_seen";

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
    setTimeout(() => setVisible(false), 850);
  }

  function colorize(cell: HTMLElement) {
    if (cell.dataset.animating === "1") return;
    cell.dataset.animating = "1";
    cell.style.background = PALETTE[Math.floor(Math.random() * PALETTE.length)];
    setTimeout(() => {
      cell.style.background = "";
      cell.dataset.animating = "0";
    }, 600);
  }

  function onGridMove(e: React.MouseEvent) {
    const grid = gridRef.current;
    if (!grid) return;
    const el = document.elementFromPoint(e.clientX, e.clientY);
    const cell = el?.closest("[data-intro-cell]");
    if (cell) colorize(cell as HTMLElement);
  }

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden"
      style={{
        transition: "transform 0.85s cubic-bezier(0.76, 0, 0.24, 1)",
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
          gridTemplateColumns: "repeat(auto-fill, minmax(52px, 1fr))",
          gridAutoRows: "52px",
          background: "#ff5c00",
        }}
      >
        {Array.from({ length: 800 }).map((_, i) => (
          <div
            key={i}
            data-intro-cell
            className="border border-[#e04e00]/40 transition-colors duration-200"
          />
        ))}
      </div>

      <button
        onClick={lift}
        className="relative z-10 select-none px-16 py-10 text-center"
      >
        <span className="block text-7xl font-bold tracking-tight text-white md:text-9xl">
          Obi
        </span>
        <span className="mt-2 block text-sm font-medium uppercase tracking-[0.4em] text-white/80">
          Onboarding Intelligence
        </span>
        <span className="mt-8 block text-xs text-white/60">
          Cliquer pour entrer
        </span>
      </button>
    </div>
  );
}
