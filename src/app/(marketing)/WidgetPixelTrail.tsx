"use client";

import { useEffect } from "react";

const COLORS: [number, number, number][] = [
  [255, 244, 170],
  [255, 200, 70],
  [255, 140, 40],
  [255, 92, 0],
  [255, 92, 0],
];

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

function perimeterPoint(rect: Rect, d: number): { x: number; y: number } {
  const P = 2 * (rect.w + rect.h);
  let t = ((d % P) + P) % P;
  if (t < rect.w) return { x: rect.x + t, y: rect.y };
  t -= rect.w;
  if (t < rect.h) return { x: rect.x + rect.w, y: rect.y + t };
  t -= rect.h;
  if (t < rect.w) return { x: rect.x + rect.w - t, y: rect.y + rect.h };
  t -= rect.w;
  return { x: rect.x, y: rect.y + rect.h - t };
}

export default function WidgetPixelTrail() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const canvas = document.createElement("canvas");
    canvas.style.cssText =
      "position:fixed;inset:0;z-index:75;pointer-events:none;";
    document.body.appendChild(canvas);
    const ctx0 = canvas.getContext("2d");
    if (!ctx0) return;
    const ctx: CanvasRenderingContext2D = ctx0;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let raf = 0;
    let activeEl: HTMLElement | null = null;
    let strength = 0;
    let head = 0;

    const SPEED = 5.2;
    const TRAIL_FRAC = 1.0;
    const PIXEL_STEP = 7;
    const GRID = 4;

    function tick() {
      ctx.clearRect(0, 0, width, height);
      const target = activeEl ? 1 : 0;
      strength += (target - strength) * (activeEl ? 0.25 : -0.12);
      if (!activeEl && strength < 0.02) {
        strength = 0;
        raf = 0;
        return;
      }

      if (activeEl) {
        const dom = activeEl.getBoundingClientRect();
        const inset = 6;
        const rect: Rect = {
          x: dom.left - inset,
          y: dom.top - inset,
          w: dom.width + inset * 2,
          h: dom.height + inset * 2,
        };
        const P = 2 * (rect.w + rect.h);
        head = (head + SPEED) % P;
        const trailLen = P * TRAIL_FRAC;
        const n = Math.max(3, Math.floor(trailLen / PIXEL_STEP));

        for (let i = 0; i < n; i++) {
          const f = i / n;
          const p = perimeterPoint(rect, head - i * PIXEL_STEP);
          const snapX = Math.round(p.x / GRID) * GRID;
          const snapY = Math.round(p.y / GRID) * GRID;
          const color = COLORS[Math.min(Math.floor(f * COLORS.length), COLORS.length - 1)];
          const alpha = Math.pow(1 - f, 1.2) * strength * 1;
          ctx.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${Math.min(alpha, 1)})`;
          const size = 5 - Math.floor(f * 2);
          ctx.fillRect(snapX - size / 2, snapY - size / 2, size, size);
        }
      }

      raf = requestAnimationFrame(tick);
    }

    function start() {
      if (!raf) raf = requestAnimationFrame(tick);
    }

    const onOver = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest?.(".widget") as HTMLElement | null;
      if (el && el !== activeEl) {
        activeEl = el;
        start();
      }
    };
    const onOut = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest?.(".widget") as HTMLElement | null;
      if (el && el === activeEl) {
        const to = (e.relatedTarget as HTMLElement | null)?.closest?.(".widget");
        if (to !== activeEl) activeEl = null;
      }
    };
    const onResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    window.addEventListener("resize", onResize);

    return () => {
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      window.removeEventListener("resize", onResize);
      if (raf) cancelAnimationFrame(raf);
      canvas.remove();
    };
  }, []);

  return null;
}
