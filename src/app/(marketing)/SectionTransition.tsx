"use client";

import { useEffect } from "react";

export default function SectionTransition() {
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-section]"));
    if (sections.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const veil = document.createElement("div");
    veil.style.cssText =
      "position:fixed;inset:0;z-index:80;pointer-events:none;opacity:0;" +
      "background:linear-gradient(160deg, rgba(255,250,242,0) 0%, rgba(255,246,236,0.85) 38%, rgba(255,122,26,0.55) 50%, rgba(255,246,236,0.85) 62%, rgba(255,250,242,0) 100%);" +
      "background-size:100% 300%;background-position:0% 100%;";
    document.body.appendChild(veil);

    let current = 0;
    let playing = false;
    let raf = 0;

    function play() {
      if (playing) return;
      playing = true;
      const start = performance.now();
      const DURATION = 520;

      function tick(now: number) {
        const p = (now - start) / DURATION;
        if (p >= 1) {
          veil.style.opacity = "0";
          playing = false;
          return;
        }
        const eased = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
        veil.style.opacity = String(Math.sin(p * Math.PI) * 0.9);
        veil.style.backgroundPosition = `0% ${100 - eased * 100}%`;
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
      veil.remove();
    };
  }, []);

  return null;
}
