"use client";

import { useEffect, useRef } from "react";

/* ─────────────────────────────────────────────────────────────────────────────
   PLYMOUTH HELM  —  scroll-physics ship's wheel
   Physics: angular momentum with damping (simulates water resistance)
   Visual:  8-spoke brass helm · animated wave ocean · lighthouse silhouette
   Fixed: bottom-right corner, hidden on mobile (<768px)
───────────────────────────────────────────────────────────────────────────── */

const SIZE = 220;          // canvas logical px (scaled for DPR)
const SPOKES = 8;
const SPOKE_RADIUS = 78;   // spoke tip to centre
const RIM_RADIUS = 90;     // outer brass ring
const HUB_RADIUS = 16;
const KNOB_RADIUS = 5.5;

// Physics constants
const SCROLL_SENSITIVITY = 0.007;
const DAMPING = 0.936;           // ~water drag
const MAX_VELOCITY = 20;         // deg per frame
const IDLE_AMPLITUDE = 0.0008;   // gentle sea-sway when no scroll

export default function PlymouthHelm() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = SIZE * dpr;
    canvas.height = SIZE * dpr;
    canvas.style.width = `${SIZE}px`;
    canvas.style.height = `${SIZE}px`;

    const ctx = canvas.getContext("2d")!;
    ctx.scale(dpr, dpr);

    // ── State ────────────────────────────────────────────────────────────────
    let angle = 0;          // degrees
    let velocity = 0;       // degrees per frame
    let lastScroll = 0;
    let idleTime = 0;
    let wavePhase = 0;
    let raf = 0;

    // ── Scroll listener ──────────────────────────────────────────────────────
    const onScroll = () => {
      const delta = window.scrollY - lastScroll;
      lastScroll = window.scrollY;
      velocity += delta * SCROLL_SENSITIVITY;
      velocity = Math.max(-MAX_VELOCITY, Math.min(MAX_VELOCITY, velocity));
      idleTime = 0;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // ── Draw helpers ─────────────────────────────────────────────────────────
    const cx = SIZE / 2;
    const cy = SIZE / 2;

    function drawWaves(speed: number) {
      const waveH = 38;
      const baseY = SIZE - waveH;
      const absSpeed = Math.min(Math.abs(speed) / MAX_VELOCITY, 1);

      // 3 wave layers: deep, mid, foam
      const layers = [
        { amp: 5 + absSpeed * 5,  freq: 0.018, phase: wavePhase,        color: "rgba(18,60,100,0.85)",  y: baseY + 4 },
        { amp: 4 + absSpeed * 4,  freq: 0.022, phase: wavePhase * 1.3,  color: "rgba(28,90,145,0.75)",  y: baseY + 2 },
        { amp: 3 + absSpeed * 6,  freq: 0.030, phase: wavePhase * 1.7,  color: "rgba(60,145,210,0.55)", y: baseY },
      ];

      for (const l of layers) {
        ctx.beginPath();
        ctx.moveTo(0, l.y);
        for (let x = 0; x <= SIZE; x += 2) {
          const y = l.y + Math.sin(x * l.freq + l.phase) * l.amp;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(SIZE, SIZE);
        ctx.lineTo(0, SIZE);
        ctx.closePath();
        ctx.fillStyle = l.color;
        ctx.fill();
      }
    }

    function drawLighthouse() {
      ctx.save();
      ctx.globalAlpha = 0.11;
      ctx.fillStyle = "#1a1a1a";

      const bx = SIZE - 36;  // base centre x
      const baseY = SIZE - 38;

      // Tower body (tapered)
      ctx.beginPath();
      ctx.moveTo(bx - 9, baseY);
      ctx.lineTo(bx + 9, baseY);
      ctx.lineTo(bx + 6, baseY - 44);
      ctx.lineTo(bx - 6, baseY - 44);
      ctx.closePath();
      ctx.fill();

      // Lantern room
      ctx.beginPath();
      ctx.rect(bx - 8, baseY - 54, 16, 10);
      ctx.fill();

      // Cap / dome
      ctx.beginPath();
      ctx.moveTo(bx - 8, baseY - 54);
      ctx.lineTo(bx + 8, baseY - 54);
      ctx.lineTo(bx, baseY - 62);
      ctx.closePath();
      ctx.fill();

      // Walkway rail
      ctx.beginPath();
      ctx.rect(bx - 10, baseY - 44, 20, 2.5);
      ctx.fill();

      ctx.restore();
    }

    function drawHelm(rad: number, glowIntensity: number) {
      const angleRad = (rad * Math.PI) / 180;

      ctx.save();
      ctx.translate(cx, cy);

      // ── Velocity glow ────────────────────────────────────────────────────
      if (glowIntensity > 0.04) {
        ctx.shadowBlur = 24 * glowIntensity;
        ctx.shadowColor = `rgba(210,175,70,${glowIntensity * 0.7})`;
      }

      ctx.rotate(angleRad);

      // ── Outer brass ring ─────────────────────────────────────────────────
      const rimGrad = ctx.createLinearGradient(-RIM_RADIUS, -RIM_RADIUS, RIM_RADIUS, RIM_RADIUS);
      rimGrad.addColorStop(0,   "#e8c84a");
      rimGrad.addColorStop(0.3, "#f5e080");
      rimGrad.addColorStop(0.6, "#c8a830");
      rimGrad.addColorStop(1,   "#b89020");

      // Outer shadow ring
      ctx.beginPath();
      ctx.arc(0, 0, RIM_RADIUS + 2, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(0,0,0,0.4)";
      ctx.lineWidth = 5;
      ctx.stroke();

      // Main rim
      ctx.beginPath();
      ctx.arc(0, 0, RIM_RADIUS, 0, Math.PI * 2);
      ctx.strokeStyle = rimGrad;
      ctx.lineWidth = 9;
      ctx.stroke();

      // Inner rim highlight
      ctx.beginPath();
      ctx.arc(0, 0, RIM_RADIUS - 4, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255,240,140,0.35)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // ── Spokes ───────────────────────────────────────────────────────────
      for (let i = 0; i < SPOKES; i++) {
        const a = (i / SPOKES) * Math.PI * 2;
        const sx = Math.cos(a) * HUB_RADIUS * 1.2;
        const sy = Math.sin(a) * HUB_RADIUS * 1.2;
        const ex = Math.cos(a) * SPOKE_RADIUS;
        const ey = Math.sin(a) * SPOKE_RADIUS;

        // Wood grain gradient along spoke
        const spokeGrad = ctx.createLinearGradient(sx, sy, ex, ey);
        spokeGrad.addColorStop(0,   "#7b4a1e");
        spokeGrad.addColorStop(0.2, "#a0632a");
        spokeGrad.addColorStop(0.5, "#8b5220");
        spokeGrad.addColorStop(0.8, "#c07a38");
        spokeGrad.addColorStop(1,   "#6e3e15");

        // Shadow
        ctx.beginPath();
        ctx.moveTo(sx + 1, sy + 1);
        ctx.lineTo(ex + 1, ey + 1);
        ctx.strokeStyle = "rgba(0,0,0,0.35)";
        ctx.lineWidth = 7;
        ctx.lineCap = "round";
        ctx.stroke();

        // Main spoke
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(ex, ey);
        ctx.strokeStyle = spokeGrad;
        ctx.lineWidth = 6;
        ctx.stroke();

        // Highlight stripe
        ctx.beginPath();
        ctx.moveTo(sx - Math.sin(a) * 1.5, sy + Math.cos(a) * 1.5);
        ctx.lineTo(ex - Math.sin(a) * 1.5, ey + Math.cos(a) * 1.5);
        ctx.strokeStyle = "rgba(255,210,130,0.22)";
        ctx.lineWidth = 2;
        ctx.stroke();

        // ── Brass knob at spoke tip ────────────────────────────────────────
        const kx = Math.cos(a) * (RIM_RADIUS - 1);
        const ky = Math.sin(a) * (RIM_RADIUS - 1);

        const knobGrad = ctx.createRadialGradient(kx - 1.5, ky - 1.5, 0.5, kx, ky, KNOB_RADIUS);
        knobGrad.addColorStop(0,   "#fff5b0");
        knobGrad.addColorStop(0.4, "#e0b840");
        knobGrad.addColorStop(1,   "#8a6010");

        ctx.beginPath();
        ctx.arc(kx, ky, KNOB_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = knobGrad;
        ctx.shadowBlur = 0;
        ctx.fill();
        ctx.strokeStyle = "rgba(0,0,0,0.3)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // ── Hub ──────────────────────────────────────────────────────────────
      const hubGrad = ctx.createRadialGradient(-4, -4, 1, 0, 0, HUB_RADIUS + 4);
      hubGrad.addColorStop(0,   "#fff5c0");
      hubGrad.addColorStop(0.3, "#e8c040");
      hubGrad.addColorStop(0.7, "#b89020");
      hubGrad.addColorStop(1,   "#7a5c10");

      ctx.beginPath();
      ctx.arc(0, 0, HUB_RADIUS + 4, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0,0,0,0.25)";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(0, 0, HUB_RADIUS + 3, 0, Math.PI * 2);
      ctx.fillStyle = hubGrad;
      ctx.fill();

      // Hub ring
      ctx.beginPath();
      ctx.arc(0, 0, HUB_RADIUS + 3, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255,240,100,0.5)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // ── Compass rose in hub ──────────────────────────────────────────────
      ctx.save();
      ctx.rotate(-angleRad); // counter-rotate so it stays upright
      const roseSize = 8;
      const dirs = ["N", "E", "S", "W"];
      dirs.forEach((d, i) => {
        const da = (i / 4) * Math.PI * 2 - Math.PI / 2;
        ctx.fillStyle = d === "N" ? "#e84040" : "rgba(255,255,255,0.75)";
        ctx.beginPath();
        ctx.moveTo(Math.cos(da) * roseSize, Math.sin(da) * roseSize);
        ctx.lineTo(Math.cos(da + 0.35) * (roseSize * 0.4), Math.sin(da + 0.35) * (roseSize * 0.4));
        ctx.lineTo(Math.cos(da - 0.35) * (roseSize * 0.4), Math.sin(da - 0.35) * (roseSize * 0.4));
        ctx.closePath();
        ctx.fill();
      });
      ctx.restore();

      ctx.restore();
    }

    // ── Label ────────────────────────────────────────────────────────────────
    function drawLabel() {
      ctx.save();
      ctx.font = "700 7.5px 'Courier New', monospace";
      ctx.fillStyle = "rgba(200,175,80,0.55)";
      ctx.letterSpacing = "0.12em";
      ctx.textAlign = "center";
      ctx.fillText("PLYMOUTH", cx, SIZE - 5);
      ctx.restore();
    }

    // ── Main render loop ─────────────────────────────────────────────────────
    function tick() {
      // Physics
      velocity *= DAMPING;
      if (Math.abs(velocity) < 0.0008) velocity = 0;
      idleTime += 0.016;

      // Idle sea-sway
      if (Math.abs(velocity) < 0.05) {
        const sway = Math.sin(idleTime * 0.8) * IDLE_AMPLITUDE * 1000;
        angle += sway * 0.06;
      }

      angle += velocity;
      wavePhase += 0.022 + Math.abs(velocity) * 0.006;

      // Glow
      const glowIntensity = Math.min(Math.abs(velocity) / MAX_VELOCITY, 1);

      // Clear
      ctx.clearRect(0, 0, SIZE, SIZE);

      // ── Background circle ────────────────────────────────────────────────
      const bgGrad = ctx.createRadialGradient(cx, cy - 10, 10, cx, cy, SIZE * 0.55);
      bgGrad.addColorStop(0,   "rgba(28, 42, 58, 0.92)");
      bgGrad.addColorStop(0.7, "rgba(14, 22, 32, 0.95)");
      bgGrad.addColorStop(1,   "rgba(5,  10, 18, 0.97)");

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, SIZE * 0.5 - 2, 0, Math.PI * 2);
      ctx.fillStyle = bgGrad;
      ctx.fill();

      // Border ring
      ctx.strokeStyle = "rgba(200,165,50,0.35)";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();

      // ── Ocean clip region ────────────────────────────────────────────────
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, SIZE * 0.5 - 3, 0, Math.PI * 2);
      ctx.clip();
      drawWaves(velocity);
      ctx.restore();

      // ── Lighthouse (behind wheel) ────────────────────────────────────────
      drawLighthouse();

      // ── Helm wheel ───────────────────────────────────────────────────────
      drawHelm(angle, glowIntensity);

      // ── KREO label ───────────────────────────────────────────────────────
      drawLabel();

      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-label="Plymouth Helm — scroll to spin"
      style={{
        position: "fixed",
        bottom: "1.8rem",
        right: "1.8rem",
        zIndex: 50,
        borderRadius: "50%",
        boxShadow: "0 8px 32px rgba(0,0,0,0.45), 0 2px 8px rgba(0,0,0,0.3)",
        cursor: "default",
        pointerEvents: "none",
        // Hide on small screens
        display: "var(--helm-display, block)",
      }}
    />
  );
}
