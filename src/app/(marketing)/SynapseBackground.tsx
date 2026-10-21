"use client";

import { useEffect, useRef } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  pulse: number;
  hub?: { x: number; y: number };
}

export default function SynapseBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx0 = canvas.getContext("2d");
    if (!ctx0) return;
    const ctx: CanvasRenderingContext2D = ctx0;

    let raf = 0;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    const mouse = { x: -1000, y: -1000 };

    const HUB_COUNT = width < 900 ? 3 : 4;
    const SAT_PER_HUB = 9;
    const hubs = Array.from({ length: HUB_COUNT }, (_, i) => ({
      x: (width / (HUB_COUNT + 1)) * (i + 1) + (Math.random() - 0.5) * width * 0.22,
      y: (height / (HUB_COUNT + 1)) * ((i % 2 === 0 ? 1 : 2.4)) + (Math.random() - 0.5) * height * 0.3,
    })).map((h) => ({
      x: Math.min(width - 10, Math.max(10, h.x)),
      y: Math.min(height - 10, Math.max(10, h.y)),
    }));

    const nodes: Node[] = [];
    hubs.forEach((h) => {
      nodes.push({
        x: h.x,
        y: h.y,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        r: 4.5 + Math.random() * 1.5,
        pulse: Math.random() * Math.PI * 2,
      });
      for (let k = 0; k < SAT_PER_HUB; k++) {
        const angle = (k / SAT_PER_HUB) * Math.PI * 2 + Math.random() * 0.6;
        const radius = 60 + Math.random() * 130;
        const sx = Math.min(width - 4, Math.max(4, h.x + Math.cos(angle) * radius));
        const sy = Math.min(height - 4, Math.max(4, h.y + Math.sin(angle) * radius));
        nodes.push({
          x: sx,
          y: sy,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          r: 1 + Math.random() * 1.4,
          pulse: Math.random() * Math.PI * 2,
          hub: h,
        });
      }
    });

    const onResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const LINK_DIST = 230;
    const MOUSE_DIST = 200;
    const WARM = "255, 92, 0";
    const INK = "41, 37, 36";

    function tick() {
      ctx.clearRect(0, 0, width, height);

      for (const n of nodes) {
        const dxm = mouse.x - n.x;
        const dym = mouse.y - n.y;
        const dm = Math.hypot(dxm, dym);
        if (dm < MOUSE_DIST && dm > 0.01) {
          const f = (MOUSE_DIST - dm) / MOUSE_DIST;
          n.x -= (dxm / dm) * f * 1.6;
          n.y -= (dym / dm) * f * 1.6;
        }
        if (n.hub) {
          n.vx += (n.hub.x - n.x) * 0.0012;
          n.vy += (n.hub.y - n.y) * 0.0012;
          n.vx *= 0.985;
          n.vy *= 0.985;
        }
        n.x += n.vx;
        n.y += n.vy;
        n.pulse += 0.02;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;
      }

      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          if (dx > LINK_DIST || dx < -LINK_DIST || dy > LINK_DIST || dy < -LINK_DIST) continue;
          const d = Math.hypot(dx, dy);
          if (d < LINK_DIST) {
            const alpha = (1 - d / LINK_DIST) * 0.3;
            const midx = (a.x + b.x) / 2;
            const midy = (a.y + b.y) / 2;
            const dm = Math.hypot(mouse.x - midx, mouse.y - midy);
            const hot = dm < MOUSE_DIST ? (1 - dm / MOUSE_DIST) * 0.6 : 0;
            ctx.strokeStyle = hot > 0.08
              ? `rgba(${WARM}, ${Math.min(alpha * 2.5 + hot, 0.85)})`
              : `rgba(${INK}, ${alpha * 0.75})`;
            ctx.lineWidth = hot > 0.1 ? 1.4 : 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      const dm0 = (x: number, y: number) => Math.hypot(mouse.x - x, mouse.y - y);
      for (const n of nodes) {
        const near = dm0(n.x, n.y) < MOUSE_DIST;
        const pulse = 0.5 + 0.5 * Math.sin(n.pulse);
        ctx.fillStyle = near
          ? `rgba(${WARM}, 0.9)`
          : `rgba(${INK}, ${0.3 + pulse * 0.15})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r + (near ? 1 : pulse * 0.6), 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(tick);
    }

    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onLeave);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="synapse-canvas" aria-hidden="true" />;
}
