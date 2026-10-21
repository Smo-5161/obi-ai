"use client";

import { useEffect, useRef, type ReactNode } from "react";

export default function RevealOnScroll({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const targets = Array.from(root.querySelectorAll<HTMLElement>(".reveal"));
    if (!targets.length) return;

    if (!("IntersectionObserver" in window)) {
      for (const t of targets) t.classList.add("is-visible");
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" },
    );
    for (const t of targets) io.observe(t);

    // Filet de sécurité : tout révéler après 2.5s quoi qu'il arrive
    const failsafe = setTimeout(() => {
      for (const t of targets) t.classList.add("is-visible");
    }, 2500);

    return () => {
      io.disconnect();
      clearTimeout(failsafe);
    };
  }, []);

  return (
    <div ref={ref} className="contents">
      {children}
    </div>
  );
}
