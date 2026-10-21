"use client";

import { useEffect } from "react";

export default function PixelTransition() {
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-section]"));
    if (sections.length < 2) return;

    const canvas = document.createElement("canvas");
    canvas.style.cssText =
      "position:fixed;inset:0;width:100vw;height:100vh;z-index:80;pointer-events:none;display:none";
    document.body.appendChild(canvas);
    const ctx0 = canvas.getContext("2d");
    if (!ctx0) return;
    const ctx: CanvasRenderingContext2D = ctx0;

    document.documentElement.classList.add("snap-landing");

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let current = 0;
    let raf = 0;
    let playing = false;

    function noise(i: number, j: number): number {
      let h = (i * 73856093) ^ (j * 19349663);
      h = (h ^ (h >>> 13)) * 1274126177;
      h = h ^ (h >>> 16);
      return (h >>> 0) / 4294967295;
    }

    function play() {
      if (playing || reduced) return;
      playing = true;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      canvas.style.display = "block";
      const cell = 26;
      const cols = Math.ceil(canvas.width / cell);
      const rows = Math.ceil(canvas.height / cell);
      const start = performance.now();
      const DURATION = 750;

      function tick(now: number) {
        const p = (now - start) / DURATION;
        if (p >= 2) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          canvas.style.display = "none";
          playing = false;
          return;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let j = 0; j < rows; j++) {
          const rowBase = (j / rows) * 0.9;
          for (let i = 0; i < cols; i++) {
            const n = noise(i, j);
            const threshold = rowBase + n * 0.12;
            if (p > threshold && p < threshold + 0.85) {
              ctx.fillStyle = n > 0.72 ? "rgba(255, 92, 0, 0.95)" : "rgba(41, 37, 36, 0.9)";
              ctx.fillRect(i * cell, j * cell, cell - 2, cell - 2);
            }
          }
        }
        raf = requestAnimationFrame(tick);
      }
      raf = requestAnimationFrame(tick);
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const idx = sections.indexOf(entry.target as HTMLElement);
          if (idx !== -1 && idx !== current) {
            current = idx;
            play();
          }
        }
      },
      { threshold: 0.55 },
    );
    for (const s of sections) io.observe(s);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("snap-landing");
      canvas.remove();
    };
  }, []);

  return null;
}
