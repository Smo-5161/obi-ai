"use client";

import { useEffect, useRef, useState } from "react";

interface CountUpProps {
  target: number;
  prefix?: string;
  suffix?: string;
  durationMs?: number;
}

export default function CountUp({
  target,
  prefix = "",
  suffix = "",
  durationMs = 1600,
}: CountUpProps) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    function run() {
      if (started.current) return;
      started.current = true;
      const start = performance.now();
      function tick(now: number) {
        const p = Math.min((now - start) / durationMs, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setValue(Math.round(eased * target));
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }

    if (!("IntersectionObserver" in window)) {
      run();
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && document.body.dataset.introDone === "1") {
            run();
            io.disconnect();
          }
        }
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    // Si l'intro n'était pas encore levée quand la métrique est devenue visible,
    // on observe l'attribut introDone pour lancer dès qu'il apparaît.
    const introPending = () => document.body.dataset.introDone !== "1";
    if (introPending() && "MutationObserver" in window) {
      const mo = new MutationObserver(() => {
        if (!introPending()) {
          mo.disconnect();
          const rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight && rect.bottom > 0) run();
        }
      });
      mo.observe(document.body, { attributes: true, attributeFilter: ["data-intro-done"] });
      return () => {
        io.disconnect();
        mo.disconnect();
      };
    }
    return () => io.disconnect();
  }, [target, durationMs]);

  return (
    <span ref={ref}>
      {prefix}
      {value}
      {suffix}
    </span>
  );
}
