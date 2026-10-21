"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  life: number;
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
    const particles: Particle[] = [];
    let last = 0;

    const onMove = (e: MouseEvent) => {
      const dx = e.clientX - tx;
      const dy = e.clientY - ty;
      if (Math.hypot(dx, dy) > 1) {
        angle = Math.atan2(dy, dx);
      }
      tx = e.clientX;
      ty = e.clientY;
      block.style.transform = `translate(${tx - 5}px, ${ty - 5}px) rotate(${(angle * 180) / Math.PI}deg)`;
      if (Date.now() - last > 14) {
        last = Date.now();
        particles.push({ x: tx, y: ty, life: 1 });
        if (particles.length > 28) particles.shift();
      }
    };
    const onResize = () => {
      width = trail.width = window.innerWidth;
      height = trail.height = window.innerHeight;
    };

    function tick() {
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        p.life -= 0.035;
      }
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
        const s = 4 * p.life;
        ctx.fillStyle = `rgba(255, 92, 0, ${0.5 * p.life})`;
        ctx.fillRect(p.x - s / 2, p.y - s / 2, s, s);
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
        style={{ width: 10, height: 10, background: "#ff5c00", boxShadow: "2px 2px 0 rgba(41, 37, 36, 0.25)" }}
      />
    </>
  );
}
