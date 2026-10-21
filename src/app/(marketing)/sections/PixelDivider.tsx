"use client";

import { useEffect, useRef } from "react";

export default function PixelDivider({ flip = false }: { flip?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx0 = canvas.getContext("2d");
    if (!ctx0) return;
    const ctx: CanvasRenderingContext2D = ctx0;

    let raf = 0;
    let width = (canvas.width = canvas.offsetWidth);
    const height = (canvas.height = 48);

    function tick(t: number) {
      ctx.clearRect(0, 0, width, height);
      const cell = 12;
      const cols = Math.ceil(width / cell);
      const rows = Math.ceil(height / cell);
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const phase = (t / 300) - i * 0.35 - j * 0.2;
          const wave = Math.sin(phase) * Math.cos(phase * 0.7);
          const on = wave > 0.55;
          if (!on) continue;
          const near = Math.abs(wave) > 0.85;
          ctx.fillStyle = near ? "rgba(255, 92, 0, 0.85)" : "rgba(41, 37, 36, 0.55)";
          const x = i * cell;
          const y = flip ? height - (j + 1) * cell : j * cell;
          ctx.fillRect(x, y, cell - 2, cell - 2);
        }
      }
      raf = requestAnimationFrame(tick);
    }

    const onResize = () => {
      width = canvas.width = canvas.offsetWidth;
    };
    window.addEventListener("resize", onResize);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [flip]);

  return (
    <div className="relative z-10 -my-px h-12 w-full overflow-hidden" aria-hidden="true">
      <canvas ref={canvasRef} className="h-12 w-full" />
    </div>
  );
}
