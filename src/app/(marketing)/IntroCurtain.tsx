"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import OmiBadge from "@/components/OmiBadge";

type Phase = "idle" | "charging" | "launching" | "curtain";

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

  const beginLift = useCallback(() => {
    setPhase((ph) => (ph === "idle" ? "charging" : ph));
  }, []);

  useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") beginLift();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible, beginLift]);

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
    if (phase !== "launching" && phase !== "curtain") return;
    const canvasBase = exhaustRef.current;
    if (!canvasBase) return;
    const canvasEl: HTMLCanvasElement = canvasBase;
    const ctx0 = canvasEl.getContext("2d");
    if (!ctx0) return;
    const ctx: CanvasRenderingContext2D = ctx0;
    canvasEl.width = window.innerWidth;
    canvasEl.height = window.innerHeight;

    let raf = 0;
    const start = performance.now();
    const LAUNCH_MS = 900;
    const particles: { x: number; y: number; vx: number; vy: number; life: number; color: string; size: number }[] = [];
    const COLORS = ["#ffd166", "#ffb347", "#ff9425", "#ff7a1a", "#ff5c00", "#f04a00"];
    const SMOKE = ["#ffffff", "#fff5ea", "#f0e6dc", "#e0d5ca"];

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
      ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);

      if (p < 1) {
        const eased = 1 - Math.pow(1 - p, 2.2);
        const r = logoRect();
        const y = r.y - eased * (window.innerHeight * 0.85);
        // flamme : traînée chaude sous le logo pendant tout le vol
        if (Math.random() < 0.9) {
          const px = r.x + r.w / 2 + (Math.random() - 0.5) * r.w * 0.7;
          particles.push({
            x: px,
            y: y + r.h,
            vx: (Math.random() - 0.5) * 1.4,
            vy: 1.6 + Math.random() * 2.4,
            life: 1,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            size: 7,
          });
        }
        // fumée : bouffées blanches denses au décollage (première moitié)
        if (p < 0.55) {
          const burst = Math.floor((0.55 - p) * 14);
          for (let k = 0; k < burst; k++) {
            const px = r.x + r.w / 2 + (Math.random() - 0.5) * r.w * 1.4;
            particles.push({
              x: px,
              y: y + r.h * 0.9 + Math.random() * 10,
              vx: (Math.random() - 0.5) * 3,
              vy: 0.8 + Math.random() * 2.2,
              life: 1,
              color: SMOKE[Math.floor(Math.random() * SMOKE.length)],
              size: 8 + Math.random() * 8,
            });
          }
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
        const s = Math.max(3, Math.round((pt.size || 7) * (0.4 + 0.6 * pt.life)));
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

    // Le rideau ne se lève qu'après que le logo a pris de l'avance (une seule fois)
    let curtainDelay: ReturnType<typeof setTimeout> | null = null;
    if (phase === "launching") {
      curtainDelay = setTimeout(() => setPhase("curtain"), 450);
    }
    return () => {
      cancelAnimationFrame(raf);
      if (curtainDelay) clearTimeout(curtainDelay);
    };
  }, [phase]);

  // Survol : zoom + brillance néon
  function onGridMove(e: React.MouseEvent) {
    if (phase !== "idle") return;
    const els = document.elementsFromPoint(e.clientX, e.clientY);
    const cell = els.find((el) => (el as HTMLElement).dataset?.introCell !== undefined);
    if (cell && cell !== lastCellRef.current) {
      lastCellRef.current = cell as HTMLElement;
      const c = cell as HTMLElement;
      if (c.dataset.animating === "1") return;
      c.dataset.animating = "1";
      c.style.borderColor = "rgba(255,255,255,0.95)";
      c.style.boxShadow = "0 0 12px rgba(255,255,255,0.7), inset 0 0 8px rgba(255,255,255,0.45)";
      setTimeout(() => {
        c.style.borderColor = "";
        c.style.boxShadow = "";
        c.dataset.animating = "0";
      }, 450);
    }
  }

  if (!visible) return null;

  const lifting = phase === "launching" || phase === "curtain";
  const curtainLifting = phase === "curtain";

  return (
    <div
      className="fixed inset-0 z-[200] overflow-hidden"
      style={{
        transition: "transform 0.9s cubic-bezier(0.76, 0, 0.24, 1)",
        transform: curtainLifting ? "translateY(-100%)" : "translateY(0)",
        pointerEvents: phase !== "idle" ? "none" : "auto",
      }}
      aria-hidden="true"
    >
      <div
        ref={gridRef}
        onMouseMove={onGridMove}
        className="absolute inset-0 grid"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(18px, 1fr))",
          gridAutoRows: "18px",
          background: "#ff5c00",
        }}
      >
        {Array.from({ length: 6400 }).map((_, i) => (
          <div
            key={i}
            data-intro-cell
            className="border border-[#e04e00]/40 transition-all duration-200 ease-out"
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
          onClick={(e) => {
            e.stopPropagation();
            beginLift();
          }}
          className="pointer-events-auto select-none text-center"
          style={{
            cursor: "pointer",
            transform: lifting
              ? "translateY(-70vh) scale(0.45)"
              : "translateY(0) scale(1)",
            transition: lifting
              ? "transform 1.1s cubic-bezier(0.36, 0, 0.7, 0.4)"
              : "transform 0.4s ease",
          }}
        >
          <span
            style={{
              display: "inline-block",
              animation: phase === "charging" ? "intro-charge 0.12s linear infinite" : "none",
              transform: phase === "charging" ? `scale(${1 + (charge / 100) * 0.08})` : undefined,
              transition: "transform 0.15s ease-out",
            }}
          >
          <OmiBadge size="lg" className="shadow-[4px_4px_0_0_var(--ink)]" />

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
                        background: filled ? ["#292524", "#ff5c00", "#e04e00", "#ff7a1a"][i % 4] : "transparent",
                        border: "1px solid #292524",
                      }}
                    />
                  );
                })}
              </span>
            </span>
          )}

          {phase === "idle" && (
            <span className="mt-8 block text-xs text-white/60">Cliquer sur le logo pour entrer</span>
          )}
        </button>
      </div>
    </div>
  );
}
