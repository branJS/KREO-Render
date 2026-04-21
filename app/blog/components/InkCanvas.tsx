"use client";
import { useEffect, useRef } from "react";

/* Floating ink-particle canvas — drifts upward, scatters from cursor */
export default function InkCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const dpr = window.devicePixelRatio || 1;
    let W = window.innerWidth, H = window.innerHeight;
    let mx = W / 2, my = H / 2;

    function resize() {
      W = window.innerWidth; H = window.innerHeight;
      canvas!.width  = W * dpr; canvas!.height = H * dpr;
      canvas!.style.width  = W + "px";
      canvas!.style.height = H + "px";
      ctx.scale(dpr, dpr);
    }
    resize();

    // Build 65 particles — 8 yellow accents, rest ink
    const particles = Array.from({ length: 65 }, (_, i) => ({
      x: Math.random() * W,
      y: Math.random() * H,
      size: Math.random() * 3.2 + 1.2,
      speed: Math.random() * 0.35 + 0.12,
      baseOp: Math.random() * 0.08 + 0.025,
      phase: Math.random() * Math.PI * 2,
      phaseX: Math.random() * Math.PI * 2,
      yellow: i < 8,
    }));

    let t = 0, raf = 0;

    function tick() {
      ctx.clearRect(0, 0, W, H);
      t += 0.007;

      for (const p of particles) {
        // Upward drift with horizontal sine wobble
        p.y -= p.speed;
        p.x += Math.sin(t * 0.8 + p.phaseX) * 0.22;

        // Cursor repulsion
        const dx = p.x - mx, dy = p.y - my;
        const d2 = dx * dx + dy * dy;
        if (d2 < 9000) {
          const d = Math.sqrt(d2);
          const f = ((95 - d) / 95) * 1.8;
          p.x += (dx / d) * f;
          p.y += (dy / d) * f;
        }

        // Wrap
        if (p.y < -12)  { p.y = H + 12; p.x = Math.random() * W; }
        if (p.x < -12)  p.x = W + 12;
        if (p.x > W+12) p.x = -12;

        // Fade at edges
        const fade = Math.min(1, Math.min(p.y / 80, (H - p.y) / 80));
        const op   = p.baseOp * fade;
        if (op <= 0) continue;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.yellow
          ? `rgba(245,193,0,${op})`
          : `rgba(13,13,13,${op})`;
        ctx.fill();
      }

      raf = requestAnimationFrame(tick);
    }

    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}
    />
  );
}
