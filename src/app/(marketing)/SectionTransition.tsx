"use client";

import { useEffect } from "react";

const SECTION_STYLES = [
  "fall",
  "slide-left",
  "fall",
  "slide-right",
  "fall",
  "slide-left",
];

export default function SectionTransition() {
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-section]"));
    if (sections.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      for (const s of sections) {
        s.classList.add("st-active");
        s.querySelectorAll<HTMLElement>(".st-item").forEach((el) =>
          el.classList.add("st-in"),
        );
      }
      return;
    }

    let current = -1;

    function activate(section: HTMLElement, style: string) {
      const items = Array.from(section.querySelectorAll<HTMLElement>(".st-item"));
      if (!items.length) return;
      section.classList.remove("st-active");
      void section.offsetWidth;
      section.classList.add("st-active");
      section.dataset.stStyle = style;
      items.forEach((el, i) => {
        el.classList.remove("st-in");
        void el.offsetWidth;
        el.style.setProperty("--st-delay", `${i * 90}ms`);
        el.style.setProperty("--st-depth", `${30 + i * 10}px`);
        requestAnimationFrame(() => el.classList.add("st-in"));
      });
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const idx = sections.indexOf(entry.target as HTMLElement);
          if (idx !== -1 && idx !== current) {
            current = idx;
            activate(entry.target as HTMLElement, SECTION_STYLES[idx % SECTION_STYLES.length]);
          }
        }
      },
      { threshold: 0.55 },
    );
    for (const s of sections) io.observe(s);

    return () => io.disconnect();
  }, []);

  return null;
}
