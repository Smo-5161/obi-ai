"use client";

import { useEffect, useRef } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

export default function SynapseBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const c: CanvasRenderingContext2D = ctx;
    let raf = 0;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    const mouse = { x: -1000, y: -1000 };

    const NODE_COUNT = Math.min(90, Math.floor((width * height) / 16000));
    const nodes: Node[] = Array.from({ length: NODE_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: 1.5 + Math.random() * 1.5,
    }));

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

    const INK = "41, 37, 36";
    const LINK_DIST = 130;
    const MOUSE_DIST = 180;

    function tick() {
      c.clearRect(0, 0, width, height);

      for (const n of nodes) {
        const dxm = mouse.x - n.x;
        const dym = mouse.y - n.y;
        const dm = Math.hypot(dxm, dym);
        if (dm < MOUSE_DIST && dm > 0.01) {
          const f = (MOUSE_DIST - dm) / MOUSE_DIST;
          n.x -= (dxm / dm) * f * 1.4;
          n.y -= (dym / dm) * f * 1.4;
        }
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;
      }

      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < LINK_DIST) {
            const alpha = (1 - d / LINK_DIST) * 0.22;
            const midx = (a.x + b.x) / 2;
            const midy = (a.y + b.y) / 2;
            const dm = Math.hypot(mouse.x - midx, mouse.y - midy);
            const hot = dm < MOUSE_DIST ? (1 - dm / MOUSE_DIST) * 0.5 : 0;
            c.strokeStyle = `rgba(${hot > 0.05 ? "194, 87, 27" : INK}, ${alpha + hot})`;
            c.lineWidth = 1;
            c.beginPath();
            c.moveTo(a.x, a.y);
            c.lineTo(b.x, b.y);
            c.stroke();
          }
        }
      }

      const dm0 = (x: number, y: number) => Math.hypot(mouse.x - x, mouse.y - y);
      for (const n of nodes) {
        const near = dm0(n.x, n.y) < MOUSE_DIST;
        c.fillStyle = near
          ? "rgba(194, 87, 27, 0.8)"
          : `rgba(${INK}, 0.45)`;
        c.beginPath();
        c.arc(n.x, n.y, n.r + (near ? 0.8 : 0), 0, Math.PI * 2);
        c.fill();
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
