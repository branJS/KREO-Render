"use client";

import { useEffect, useState } from "react";

export default function IntroScreen() {
  const [phase, setPhase] = useState<"in" | "hold" | "out" | "done">("in");

  useEffect(() => {
    // Only show once per browser session
    if (typeof sessionStorage !== "undefined" && sessionStorage.getItem("kreo-intro")) {
      setPhase("done");
      return;
    }
    sessionStorage.setItem("kreo-intro", "1");

    // Timeline: logo enters → hold → exit
    const t1 = setTimeout(() => setPhase("hold"), 100);   // tiny delay so CSS can mount
    const t2 = setTimeout(() => setPhase("out"),  2600);  // start exit
    const t3 = setTimeout(() => setPhase("done"), 3400);  // unmount
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  if (phase === "done") return null;

  const leaving = phase === "out";
  const entered = phase === "hold" || phase === "out";

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed", inset: 0, zIndex: 99999,
        background: "#0D0D0D",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        pointerEvents: leaving ? "none" : "all",
        /* Slide the entire curtain up on exit */
        transform: leaving ? "translateY(-102%)" : "translateY(0)",
        transition: leaving ? "transform 0.85s cubic-bezier(0.76,0,0.24,1)" : "none",
      }}
    >
      {/* Yellow logo */}
      <div style={{
        opacity: entered ? 1 : 0,
        transform: entered ? "translateY(0) scale(1)" : "translateY(28px) scale(0.94)",
        transition: "opacity 0.7s ease, transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94)",
      }}>
        <img
          src="/logos/kreo-yellow-crop.png"
          alt="KREO"
          style={{
            width: "min(480px, 78vw)",
            height: "auto",
            display: "block",
            /* Subtle breathing pulse on the logo */
            animation: entered ? "kreo-intro-pulse 2.4s ease-in-out infinite" : "none",
          }}
        />
      </div>

      {/* Tagline */}
      <p style={{
        color: "rgba(255,255,255,0.4)",
        fontFamily: "Space Grotesk, system-ui",
        fontWeight: 600,
        letterSpacing: "0.28em",
        fontSize: "0.68rem",
        textAlign: "center",
        marginTop: "1.8rem",
        opacity: entered ? 1 : 0,
        transform: entered ? "translateY(0)" : "translateY(12px)",
        transition: "opacity 0.6s 0.25s ease, transform 0.6s 0.25s ease",
      }}>
        VISUALS &nbsp;·&nbsp; MOTION &nbsp;·&nbsp; INTERACTION
      </p>

      {/* Loading bar */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        height: "3px",
        background: "rgba(255,255,255,0.08)",
        overflow: "hidden",
      }}>
        <div style={{
          height: "100%",
          background: "var(--yellow)",
          animation: "kreo-intro-bar 2.4s cubic-bezier(0.4,0,0.2,1) forwards",
        }} />
      </div>
    </div>
  );
}
