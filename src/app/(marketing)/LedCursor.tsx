"use client";

import { useEffect, useRef } from "react";

interface Point {
  x: number;
  y: number;
  t: number;
}

export default function LedCursor() {
  const blockRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const block = blockRef.current;
    const trail = trailRef.current;
    if (!block || !trail) return;
    const ctx0 = trail.getContext("2d");
    if (!ctx0) return;
    const ctx: CanvasRenderingContext2D = ctx0;

    let width = (trail.width = window.innerWidth);
    let height = (trail.height = window.innerHeight);
    let raf = 0;
    let tx = -100;
    let ty = -100;
    let angle = 0;
    const points: Point[] = [];
    const TRAIL_MS = 220;

    const onMove = (e: MouseEvent) => {
      const dx = e.clientX - tx;
      const dy = e.clientY - ty;
      if (Math.hypot(dx, dy) > 1) {
        angle = Math.atan2(dy, dx);
      }
      tx = e.clientX;
      ty = e.clientY;
      points.push({ x: tx, y: ty, t: performance.now() });
      block.style.transform = `translate(${tx - 5}px, ${ty - 5}px) rotate(${(angle * 180) / Math.PI}deg)`;
    };
    const onResize = () => {
      width = trail.width = window.innerWidth;
      height = trail.height = window.innerHeight;
    };

    function tick(now: number) {
      ctx.clearRect(0, 0, width, height);

      while (points.length && now - points[0].t > TRAIL_MS) {
        points.shift();
      }
      if (points.length >= 2) {
        ctx.globalCompositeOperation = "lighter";
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        for (let i = 1; i < points.length; i++) {
          const p0 = points[i - 1];
          const p1 = points[i];
          const age = 1 - (now - p1.t) / TRAIL_MS;
          const w = 7 * age + 0.5;
          ctx.strokeStyle = `rgba(255, 92, 0, ${0.55 * age})`;
          ctx.lineWidth = w;
          ctx.beginPath();
          ctx.moveTo(p0.x, p0.y);
          ctx.lineTo(p1.x, p1.y);
          ctx.stroke();

          ctx.strokeStyle = `rgba(255, 165, 60, ${0.85 * age})`;
          ctx.lineWidth = Math.max(w * 0.35, 0.5);
          ctx.beginPath();
          ctx.moveTo(p0.x, p0.y);
          ctx.lineTo(p1.x, p1.y);
          ctx.stroke();

          ctx.strokeStyle = `rgba(255, 235, 200, ${0.9 * age})`;
          ctx.lineWidth = Math.max(w * 0.12, 0.3);
          ctx.beginPath();
          ctx.moveTo(p0.x, p0.y);
          ctx.lineTo(p1.x, p1.y);
          ctx.stroke();
        }
      }

      raf = requestAnimationFrame(tick);
    }

    window.addEventListener("mousemove", onMove);
    window.addEventListener("resize", onResize);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <>
      <canvas ref={trailRef} className="cursor-led__trail" aria-hidden="true" />
      <div
        ref={blockRef}
        className="cursor-led"
        aria-hidden="true"
        style={{
          width: 10,
          height: 10,
          background: "#ff5c00",
          boxShadow:
            "0 0 6px rgba(255,92,0,0.9), 0 0 14px rgba(255,92,0,0.5), 2px 2px 0 rgba(41,37,36,0.25)",
        }}
      />
    </>
  );
}
