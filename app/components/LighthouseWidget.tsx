"use client";

/* -------------------------------------------------------
   Lighthouse Widget — Plymouth, Ocean City
   Fixed bottom-left, minimal & decorative.
   ------------------------------------------------------- */
export default function LighthouseWidget() {
  return (
    <div
      title="Plymouth, Devon · The Ocean City"
      style={{
        position: "fixed",
        bottom: "1.2rem",
        left: "1.2rem",
        zIndex: 7,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "2px",
        opacity: 0.28,
        pointerEvents: "none",
        userSelect: "none",
      }}
    >
      <style>{`
        @keyframes lh-beam {
          0%   { transform: rotate(-30deg); opacity: 0.9; }
          50%  { transform: rotate(30deg);  opacity: 0.4; }
          100% { transform: rotate(-30deg); opacity: 0.9; }
        }
        @keyframes lh-pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.55; }
        }
      `}</style>

      {/* Beam */}
      <div style={{
        position: "absolute",
        bottom: "38px",
        left: "50%",
        width: "0",
        height: "0",
        transformOrigin: "0 100%",
        animation: "lh-beam 3s ease-in-out infinite",
      }}>
        <div style={{
          position: "absolute",
          bottom: 0,
          left: "-18px",
          width: 0,
          height: 0,
          borderLeft: "18px solid transparent",
          borderRight: "18px solid transparent",
          borderBottom: "52px solid var(--yellow)",
          opacity: 0.7,
          filter: "blur(2px)",
        }} />
      </div>

      {/* Lighthouse SVG */}
      <svg
        width="32"
        height="56"
        viewBox="0 0 32 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block", flexShrink: 0 }}
      >
        {/* Lantern room */}
        <rect x="10" y="2" width="12" height="8" rx="1" fill="currentColor" />
        {/* Light pulse */}
        <rect
          x="12" y="4" width="8" height="4" rx="0.5"
          fill="var(--yellow)"
          style={{ animation: "lh-pulse 3s ease-in-out infinite" }}
        />
        {/* Gallery railing */}
        <rect x="8" y="10" width="16" height="2" rx="0.5" fill="currentColor" />
        {/* Tower — tapered */}
        <path d="M10 12 L8 48 L24 48 L22 12 Z" fill="currentColor" />
        {/* Stripe detail */}
        <rect x="9" y="22" width="14" height="4" fill="var(--yellow)" opacity="0.55" />
        <rect x="9" y="34" width="14" height="4" fill="var(--yellow)" opacity="0.55" />
        {/* Base */}
        <rect x="6" y="48" width="20" height="4" rx="1" fill="currentColor" />
        {/* Door */}
        <path d="M14 48 L14 42 Q16 40 18 42 L18 48 Z" fill="var(--yellow)" opacity="0.5" />
        {/* Water line */}
        <path d="M0 53 Q8 51 16 53 Q24 55 32 53" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.5" />
        <path d="M0 56 Q8 54 16 56 Q24 58 32 56" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.3" />
      </svg>

      {/* Label */}
      <span style={{
        fontFamily: "Space Grotesk, system-ui",
        fontWeight: 700,
        fontSize: "0.46rem",
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: "currentColor",
        whiteSpace: "nowrap",
        marginTop: "2px",
      }}>
        Plymouth
      </span>
    </div>
  );
}
