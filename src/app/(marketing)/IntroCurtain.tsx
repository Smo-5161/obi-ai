"use client";

import { useEffect, useRef, useState } from "react";

// Dégradé logique : chaque carré s'illumine selon sa position horizontale
const GRADIENT = ["#ffd166", "#ffb347", "#ff9425", "#ff7a1a", "#ff5c00", "#f04a00", "#e63b0f"];

type Phase = "idle" | "charging" | "launching";

export default function IntroCurtain() {
  const [visible, setVisible] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [charge, setCharge] = useState(0);
  const gridRef = useRef<HTMLDivElement>(null);
  const lastCellRef = useRef<HTMLElement | null>(null);
  const exhaustRef = useRef<HTMLCanvasElement>(null);

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
      if (e.key === "Escape") beginLift();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible]);

  // Phase de charge : remplissage progressif puis lancement
  useEffect(() => {
    if (phase !== "charging") return;
    const start = performance.now();
    let raf = 0;
    function tick(now: number) {
      const p = Math.min((now - start) / 700, 1);
      setCharge(Math.round(p * 100));
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setPhase("launching");
      }
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  // Lancement : logo vers le haut + particules pixel qui tombent
  useEffect(() => {
    if (phase !== "launching") return;
    const canvasEl = exhaustRef.current;
    if (!canvasEl) return;
    const canvas: HTMLCanvasElement = canvasEl;
    const ctx0 = canvas.getContext("2d");
    if (!ctx0) return;
    const ctx: CanvasRenderingContext2D = ctx0;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let raf = 0;
    const start = performance.now();
    const LAUNCH_MS = 900;
    const particles: { x: number; y: number; vx: number; vy: number; life: number; color: string }[] = [];
    const COLORS = ["#ffd166", "#ffb347", "#ff9425", "#ff7a1a", "#ff5c00", "#f04a00"];

    function logoRect() {
      const w = Math.min(window.innerWidth * 0.3, 260);
      const h = w * 0.34;
      return {
        x: window.innerWidth / 2 - w / 2,
        y: window.innerHeight / 2 - h / 2,
        w,
        h,
      };
    }

    function tick(now: number) {
      const p = Math.min((now - start) / LAUNCH_MS, 1);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (p < 1) {
        const eased = 1 - Math.pow(1 - p, 2.2);
        const r = logoRect();
        const y = r.y - eased * (window.innerHeight * 0.85);
        if (Math.random() < 0.9) {
          const px = r.x + r.w / 2 + (Math.random() - 0.5) * r.w * 0.7;
          particles.push({
            x: px,
            y: y + r.h,
            vx: (Math.random() - 0.5) * 1.4,
            vy: 1.6 + Math.random() * 2.4,
            life: 1,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
          });
        }
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const pt = particles[i];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.vy *= 1.03;
        pt.life -= 0.028;
        if (pt.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
        const s = Math.max(3, Math.round(7 * pt.life));
        ctx.fillStyle = pt.color;
        ctx.globalAlpha = Math.min(pt.life, 0.9);
        const sx = Math.round(pt.x / 4) * 4;
        const sy = Math.round(pt.y / 4) * 4;
        ctx.fillRect(sx, sy, s, s);
      }
      ctx.globalAlpha = 1;

      if (p >= 1 && particles.length === 0) {
        setVisible(false);
        return;
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    document.body.dataset.introDone = "1";
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  function beginLift() {
    if (phase !== "idle") return;
    setPhase("charging");
  }

  function onGridMove(e: React.MouseEvent) {
    if (phase !== "idle") return;
    const grid = gridRef.current;
    if (!grid) return;
    const els = document.elementsFromPoint(e.clientX, e.clientY);
    const cell = els.find((el) => (el as HTMLElement).dataset?.introCell !== undefined);
    if (cell && cell !== lastCellRef.current) {
      lastCellRef.current = cell as HTMLElement;
      const c = cell as HTMLElement;
      if (c.dataset.animating === "1") return;
      c.dataset.animating = "1";
      const rect = c.getBoundingClientRect();
      const gx = (rect.left + rect.width / 2) / window.innerWidth;
      const idx = Math.min(GRADIENT.length - 1, Math.floor(gx * GRADIENT.length));
      c.style.backgroundColor = GRADIENT[idx];
      setTimeout(() => {
        c.style.backgroundColor = "";
        c.dataset.animating = "0";
      }, 600);
    }
  }

  if (!visible) return null;

  const lifting = phase === "launching";

  return (
    <div
      className="fixed inset-0 z-[200] overflow-hidden"
      style={{
        transition: "transform 0.9s cubic-bezier(0.76, 0, 0.24, 1)",
        transform: lifting ? "translateY(-100%)" : "translateY(0)",
        pointerEvents: phase !== "idle" ? "none" : "auto",
        cursor: "default",
      }}
      aria-hidden="true"
    >
      <div
        ref={gridRef}
        onMouseMove={onGridMove}
        onClick={beginLift}
        className="absolute inset-0 grid"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(24px, 1fr))",
          gridAutoRows: "24px",
          background: "#ff5c00",
          cursor: "default",
        }}
      >
        {Array.from({ length: 3600 }).map((_, i) => (
          <div
            key={i}
            data-intro-cell
            className="border border-[#e04e00]/40 transition-colors duration-200"
          />
        ))}
      </div>

      <canvas
        ref={exhaustRef}
        className="pointer-events-none absolute inset-0"
        style={{ display: lifting ? "block" : "none" }}
      />

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <button
          onClick={beginLift}
          className="pointer-events-auto select-none text-center"
          style={{
            transform: lifting ? "translateY(-85vh) scale(0.4)" : "translateY(0) scale(1)",
            transition: lifting ? "transform 0.85s cubic-bezier(0.5, 0, 0.9, 0.35)" : "none",
            animation: phase === "charging" ? "intro-charge 0.12s linear infinite" : "none",
          }}
        >
          <span
            className="inline-block rounded-none border-2 border-ink bg-accent px-3 py-1.5 text-5xl font-bold text-background shadow-[4px_4px_0_0_var(--ink)] md:px-4 md:py-2 md:text-6xl"
            style={{
              transform: phase === "charging" ? `scale(${1 + (charge / 100) * 0.08})` : undefined,
            }}
          >
            Obi
          </span>

          {phase === "charging" && (
            <span className="mx-auto mt-6 block w-56 border-2 border-ink bg-background p-1 shadow-[3px_3px_0_0_var(--ink)]">
              <span className="flex gap-[3px]">
                {Array.from({ length: 16 }).map((_, i) => {
                  const filled = i < Math.round((charge / 100) * 16);
                  return (
                    <span
                      key={i}
                      className="h-3 flex-1"
                      style={{
                        background: filled ? GRADIENT[i % 4] : "transparent",
                        border: "1px solid #292524",
                      }}
                    />
                  );
                })}
              </span>
            </span>
          )}

          {phase === "idle" && (
            <span className="mt-8 block text-xs text-white/60">Cliquer pour entrer</span>
          )}
        </button>
      </div>
    </div>
  );
}
