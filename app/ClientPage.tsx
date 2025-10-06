"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

/* ----------------  Hooks ---------------- */
function useRootMouseVars() {
  useEffect(() => {
    const r = document.documentElement;
    const onMove = (e: MouseEvent) => {
      r.style.setProperty("--mx", e.clientX + "px");
      r.style.setProperty("--my", e.clientY + "px");
      r.style.setProperty("--mxp", (e.clientX / innerWidth).toFixed(4));
      r.style.setProperty("--myp", (e.clientY / innerHeight).toFixed(4));
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);
}

function useSound() {
  const [muted, setMuted] = useState(false);
  useEffect(() => {
    const bg = document.getElementById("bg-music") as HTMLAudioElement | null;
    if (!bg) return;
    bg.volume = 0.18;
    const start = () => bg.play().catch(() => {});
    document.addEventListener("click", start, { once: true });
    start();
  }, []);
  useEffect(() => {
    ["bg-music", "hover-sfx", "click-sfx"].forEach((id) => {
      const a = document.getElementById(id) as HTMLAudioElement | null;
      if (a) a.muted = muted;
    });
  }, [muted]);
  return { muted, setMuted };
}

function useMagnetic() {
  useEffect(() => {
    const els = Array.from(
      document.querySelectorAll<HTMLElement>("[data-magnetic]")
    );
    let raf = 0,
      mx = 0,
      my = 0;
    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const apply = () => {
      els.forEach((el) => {
        const r = el.getBoundingClientRect();
        const dx = mx - (r.left + r.width / 2);
        const dy = my - (r.top + r.height / 2);
        const pull = Math.max(0, 1 - Math.hypot(dx, dy) / 240);
        const ease = 0.24;
        const tx = dx * 0.12 * pull,
          ty = dy * 0.12 * pull;
        const prev = el.style.transform.match(
          /translate\(([-0-9.]+)px,\s*([-0-9.]+)px\)/
        );
        const px = prev ? parseFloat(prev[1]) : 0;
        const py = prev ? parseFloat(prev[2]) : 0;
        el.style.transform = `translate(${px + (tx - px) * ease}px, ${
          py + (ty - py) * ease
        }px)`;
      });
      raf = 0;
    };
    window.addEventListener("mousemove", onMove);
    const clear = () =>
      els.forEach((el) => (el.style.transform = "translate(0,0)"));
    window.addEventListener("mouseout", clear);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseout", clear);
    };
  }, []);
}

/* ----------------  HUD ---------------- */
function HUD({
  muted,
  setMuted,
}: {
  muted: boolean;
  setMuted: (v: boolean) => void;
}) {
  const time = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  return (
    <div className="hud">
      <div className="hud-left">
        <span className="tag bold">KREO v5 — Revamp</span>
      </div>
      <div className="hud-center">
        <nav className="hud-nav">
          {[
            "home",
            "projects",
            "about",
            "contact",
            "blog",
            "shop",
            "downloads",
          ].map((s) => (
            <a
              key={s}
              href={`#${s}`}
              className="hud-link"
              onClick={(e) => {
                e.preventDefault();
                window.dispatchEvent(
                  new CustomEvent("kreo:navigate", { detail: { section: s } })
                );
                const target = document.getElementById(s);
                if (target)
                  target.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              {s.toUpperCase()}
            </a>
          ))}
        </nav>
      </div>
      <div className="hud-right">
        <button className="hud-btn sound" onClick={() => setMuted(!muted)}>
          {muted ? "🔇 SOUND" : "🔊 SOUND"}
        </button>
        <span className="hud-time">{time}</span>
      </div>
    </div>
  );
}

/* ----------------  World Scene  ---------------- */
const WorldScene = dynamic(() => import("./WorldScene"), { ssr: false });

/* ----------------  Client wrapper  ---------------- */
export default function ClientPage({
  children,
}: {
  children: React.ReactNode;
}) {
  useRootMouseVars();
  useMagnetic();
  const { muted, setMuted } = useSound();

  return (
    <main className="kreo">
      <WorldScene
        sections={[
          "home",
          "projects",
          "about",
          "contact",
          "blog",
          "shop",
          "downloads",
        ]}
      />
      <HUD muted={muted} setMuted={setMuted} />
      {children}

      {/* your static sections remain untouched below */}
      {/* HERO, BLOG, SHOP, etc. can stay in separate files or here */}
    </main>
  );
}
