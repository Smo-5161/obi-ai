"use client";

import { useEffect, useRef, type ReactNode } from "react";

export default function RevealOnScroll({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const targets = [el, ...Array.from(el.querySelectorAll<HTMLElement>(".reveal-target"))];
    const targetsSet = new Set(targets);
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12 },
    );
    for (const t of targetsSet) {
      if (t.classList.contains("reveal")) io.observe(t);
    }
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="contents">
      {children}
    </div>
  );
}
