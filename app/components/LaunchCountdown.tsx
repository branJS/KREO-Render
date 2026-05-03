"use client";

import { useEffect, useState, useCallback } from "react";

/* ─────────────────────────────────────────────
   SET YOUR LAUNCH TIME HERE (UTC)
   Current setting: 24 hours from ~20:35 BST on 18 Apr 2026
   ───────────────────────────────────────────── */
const LAUNCH_TIME = new Date("2026-04-19T19:35:00Z").getTime();

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function getTimeLeft() {
  const diff = LAUNCH_TIME - Date.now();
  if (diff <= 0) return null;
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return { h, m, s };
}

export default function LaunchCountdown() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft);
  const [exiting, setExiting] = useState(false);
  const [gone, setGone] = useState(false);

  const tick = useCallback(() => {
    const t = getTimeLeft();
    if (!t) {
      setExiting(true);
      setTimeout(() => setGone(true), 1200);
    } else {
      setTimeLeft(t);
    }
  }, []);

  useEffect(() => {
    // Already past launch time on mount
    if (!getTimeLeft()) {
      setGone(true);
      return;
    }
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [tick]);

  if (gone) return null;

  const t = timeLeft ?? { h: 0, m: 0, s: 0 };

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999999,
        background: "#000",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Space Grotesk, system-ui, sans-serif",
        overflow: "hidden",
        opacity: exiting ? 0 : 1,
        transition: exiting ? "opacity 1.2s ease" : "none",
        pointerEvents: exiting ? "none" : "all",
      }}
    >
      <style>{`
        @keyframes cd-scan {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes cd-blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        @keyframes cd-pulse-bar {
          0%, 100% { opacity: 0.18; }
          50%       { opacity: 0.38; }
        }
      `}</style>

      {/* Grid background */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
        pointerEvents: "none",
      }} />

      {/* Scanline */}
      <div style={{
        position: "absolute", left: 0, right: 0,
        height: "160px",
        background: "linear-gradient(transparent, rgba(245,197,24,0.04), transparent)",
        animation: "cd-scan 6s linear infinite",
        pointerEvents: "none",
      }} />

      {/* Yellow top bar */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0,
        height: "3px",
        background: "var(--yellow, #F5C518)",
        animation: "cd-pulse-bar 4s ease-in-out infinite",
      }} />

      {/* Top label */}
      <p style={{
        color: "rgba(255,255,255,0.28)",
        fontSize: "0.68rem",
        letterSpacing: "0.32em",
        fontWeight: 700,
        textTransform: "uppercase",
        marginBottom: "2.4rem",
      }}>
        Studio Launch
      </p>

      {/* KREO logo */}
      <img
        src="/logos/kreo-yellow-crop.png"
        alt="KREO"
        style={{
          width: "min(360px, 68vw)",
          height: "auto",
          display: "block",
          marginBottom: "3rem",
          opacity: 0.95,
        }}
      />

      {/* Countdown digits */}
      <div style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "0",
      }}>
        {[
          { label: "HRS",  value: pad(t.h) },
          { label: "MIN",  value: pad(t.m) },
          { label: "SEC",  value: pad(t.s) },
        ].map((unit, i) => (
          <div key={unit.label} style={{ display: "flex", alignItems: "flex-start" }}>
            {i > 0 && (
              <span style={{
                fontSize: "clamp(3rem, 8vw, 6rem)",
                fontWeight: 900,
                color: "rgba(255,255,255,0.18)",
                lineHeight: 1,
                padding: "0 0.15em",
                animation: "cd-blink 1s step-end infinite",
                marginTop: "0.05em",
              }}>:</span>
            )}
            <div style={{ textAlign: "center" }}>
              <div style={{
                fontSize: "clamp(4rem, 11vw, 8rem)",
                fontWeight: 900,
                color: "#fff",
                lineHeight: 1,
                letterSpacing: "-0.03em",
                fontVariantNumeric: "tabular-nums",
              }}>
                {unit.value}
              </div>
              <div style={{
                fontSize: "0.58rem",
                fontWeight: 700,
                letterSpacing: "0.24em",
                color: "var(--yellow, #F5C518)",
                marginTop: "0.4rem",
              }}>
                {unit.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div style={{
        width: "min(480px, 72vw)",
        height: "1px",
        background: "rgba(255,255,255,0.08)",
        margin: "3rem 0 1.6rem",
      }} />

      {/* Footer text */}
      <p style={{
        color: "rgba(255,255,255,0.22)",
        fontSize: "0.72rem",
        fontWeight: 600,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
      }}>
        kreostudio.co.uk
      </p>

      {/* Bottom bar */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        height: "3px",
        background: "var(--yellow, #F5C518)",
        animation: "cd-pulse-bar 4s ease-in-out infinite",
      }} />
    </div>
  );
}
