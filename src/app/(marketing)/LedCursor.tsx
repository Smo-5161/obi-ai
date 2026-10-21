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
    const points: Point[] = [];
    const TRAIL_MS = 420;

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      points.push({ x: tx, y: ty, t: performance.now() });
      block.style.transform = `translate(${tx - 4}px, ${ty - 4}px)`;
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
        // Traînée courbe lisse : une seule path quadratic à travers les points
        const pts = points.slice(-24);
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        for (let i = 1; i < pts.length; i++) {
          const p0 = pts[i - 1];
          const p1 = pts[i];
          const age = 1 - (now - p1.t) / TRAIL_MS;
          // fine (2px), dégradé d'opacité vers la queue
          ctx.strokeStyle = `rgba(255, 92, 0, ${0.85 * age})`;
          ctx.lineWidth = 2;
          const midX = (p0.x + p1.x) / 2;
          const midY = (p0.y + p1.y) / 2;
          ctx.beginPath();
          ctx.moveTo(p0.x, p0.y);
          ctx.quadraticCurveTo(midX, midY, p1.x, p1.y);
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
          width: 8,
          height: 8,
          background: "#ff5c00",
        }}
      />
    </>
  );
}
