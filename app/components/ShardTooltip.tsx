"use client";

/**
 * components/ShardTooltip.tsx
 *
 * Lightweight DOM overlay rendered above the WebGL canvas.
 * No animation — appears/disappears instantly to match the brief.
 * Positioned with absolute (clientX, clientY) coords offset by 14px.
 *
 * Styling intentionally inlined: this component is rendered in a portal-like
 * context (separate from the rest of the panel) and shouldn't depend on parent
 * cascade. Colors mirror the existing brutalist language in globals.css.
 */

import React from "react";

export type ShardTooltipProps = {
  visible: boolean;
  x: number;          // viewport pixel
  y: number;          // viewport pixel
  title: string | null;
  subtitle: string | null;
};

const OFFSET_X = 14;
const OFFSET_Y = 14;

export function ShardTooltip({ visible, x, y, title, subtitle }: ShardTooltipProps) {
  if (!visible || !title) return null;

  // Keep the tooltip inside the viewport — flip horizontally near the right edge.
  const flipX = x > window.innerWidth - 240;
  const tx = flipX ? x - OFFSET_X - 220 : x + OFFSET_X;
  const ty = Math.min(y + OFFSET_Y, window.innerHeight - 72);

  return (
    <div
      role="tooltip"
      aria-live="polite"
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        transform: `translate3d(${tx}px, ${ty}px, 0)`,
        zIndex: 50,
        pointerEvents: "none",

        background: "var(--ink)",
        color: "var(--cream)",
        border: "3px solid var(--ink)",
        boxShadow: "5px 5px 0 var(--yellow)",
        padding: "0.45rem 0.7rem",
        minWidth: 140,
        maxWidth: 240,

        fontFamily: "'Space Grotesk', system-ui, sans-serif",
        fontWeight: 700,
        fontSize: "0.78rem",
        lineHeight: 1.25,
        letterSpacing: "0.02em",
      }}
    >
      <div
        style={{
          fontSize: "0.6rem",
          fontWeight: 800,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          opacity: 0.55,
          marginBottom: 2,
          fontFamily: "monospace",
        }}
      >
        {subtitle ?? "Project"}
      </div>
      <div
        style={{
          fontSize: "0.85rem",
          fontWeight: 800,
          letterSpacing: "0.01em",
        }}
      >
        {title}
      </div>
    </div>
  );
}

export default ShardTooltip;
