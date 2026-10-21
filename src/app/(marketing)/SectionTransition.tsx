"use client";

import { useEffect } from "react";

export default function SectionTransition() {
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-section]"));
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!sections.length) return;

    function showAll() {
      for (const s of sections) {
        s.classList.add("st-in");
        s.querySelectorAll<HTMLElement>(".st-item").forEach((el) => el.classList.add("st-in"));
        s.querySelectorAll<HTMLElement>("[data-typewriter]").forEach((el) =>
          el.setAttribute("data-tw-done", "1"),
        );
      }
    }

    if (reduced) {
      showAll();
      return;
    }

    let current = -1;
    const timers: ReturnType<typeof setTimeout>[] = [];

    function typeText(el: HTMLElement, delay: number) {
      const full = el.getAttribute("data-typewriter") || "";
      if (!full) return;
      const speed = Math.max(6, Math.min(13, 420 / full.length));
      const t = setTimeout(() => {
        let i = 0;
        el.classList.add("tw-active");
        el.textContent = "";
        const span = document.createElement("span");
        span.className = "tw-caret";
        el.appendChild(span);
        const step = () => {
          if (i < full.length) {
            span.insertAdjacentText("beforebegin", full[i]);
            i++;
            timers.push(setTimeout(step, speed));
          } else {
            span.remove();
          }
        };
        step();
      }, delay);
      timers.push(t);
    }

    function activate(section: HTMLElement) {
      section.classList.remove("st-in");
      void section.offsetWidth;
      section.classList.add("st-in");
      const items = Array.from(section.querySelectorAll<HTMLElement>(".st-item"));
      items.forEach((el, i) => {
        el.classList.remove("st-in");
        void el.offsetWidth;
        el.style.setProperty("--st-delay", `${i * 110}ms`);
        requestAnimationFrame(() => el.classList.add("st-in"));
      });
      section
        .querySelectorAll<HTMLElement>("[data-typewriter]")
        .forEach((el) => typeText(el, 150));
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const idx = sections.indexOf(entry.target as HTMLElement);
          if (idx !== -1 && idx !== current) {
            current = idx;
            activate(entry.target as HTMLElement);
          }
        }
      },
      { threshold: 0.35 },
    );
    for (const s of sections) io.observe(s);

    current = 0;
    if (sections[0]) activate(sections[0]);

    const failsafe = setTimeout(showAll, 2500);

    return () => {
      io.disconnect();
      timers.forEach(clearTimeout);
      clearTimeout(failsafe);
    };
  }, []);

  return null;
}
