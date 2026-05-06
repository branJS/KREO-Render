"use client";

/**
 * components/WordmarkArtefact.tsx
 *
 * Client wrapper that mounts a contained Three.js canvas in the hero
 * wordmark slot and renders the GlassArtefact inside it. Owns:
 *   - Sanity project fetch
 *   - Canvas sizing & camera setup
 *   - DOM-level tooltip overlay (sibling to the canvas, not inside it)
 *
 * Replaces the previous <img src="/logos/kreo-black-crop.png" /> that lived
 * in app/page.tsx. The image is still used as the alpha mask source for
 * Voronoi cell culling — it's never displayed.
 */

import React, { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { client } from "@/lib/sanity";
import { groq } from "next-sanity";

import GlassArtefact from "./GlassArtefact";
import ShardTooltip from "./ShardTooltip";
import type { ProjectMeta } from "@/lib/voronoi";

const PROJECT_QUERY = groq`*[_type == "project" && !(_id in path("drafts.**"))] | order(featured desc, order asc, publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  category,
  publishedAt,
  featured,
  tags
}`;

type TooltipState = {
  title: string | null;
  subtitle: string | null;
  x: number;
  y: number;
} | null;

export default function WordmarkArtefact() {
  const [projects, setProjects] = useState<ProjectMeta[]>([]);
  const [tooltip, setTooltip] = useState<TooltipState>(null);

  // Fetch projects once on mount. If Sanity is unreachable or returns
  // nothing, the artefact still renders with neutral colours.
  useEffect(() => {
    let cancelled = false;
    client
      .fetch<ProjectMeta[]>(PROJECT_QUERY)
      .then((data) => {
        if (!cancelled && Array.isArray(data)) {
          setProjects(data);
        }
      })
      .catch(() => {
        // Silent: artefact still mounts with no project mapping.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <div
        className="kreo-wordmark-artefact"
        aria-label="KREO"
        role="img"
        style={{
          width: "min(900px, 96vw)",
          // Reserve enough vertical room for shard dissolution outside the
          // wordmark bounds. The visible wordmark itself sits in the centre.
          height: "clamp(220px, 28vw, 320px)",
          margin: "0 auto",
          position: "relative",
          // Allow the canvas inside to capture pointer events; the
          // surrounding wrapper itself doesn't need to.
          pointerEvents: "none",
        }}
      >
        <Canvas
          dpr={[1, 2]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
            preserveDrawingBuffer: false,
          }}
          camera={{
            position: [0, 0, 9],
            fov: 38,
            near: 0.1,
            far: 60,
          }}
          style={{
            width: "100%",
            height: "100%",
            // Pointer events go through the wrapper but are captured here so
            // shard hover/click works.
            pointerEvents: "auto",
          }}
        >
          <GlassArtefact
            projects={projects}
            silhouetteSrc="/logos/kreo-black-crop.png"
            onShardHover={setTooltip}
          />
        </Canvas>
      </div>

      <ShardTooltip
        visible={tooltip !== null}
        x={tooltip?.x ?? 0}
        y={tooltip?.y ?? 0}
        title={tooltip?.title ?? null}
        subtitle={tooltip?.subtitle ?? null}
      />
    </>
  );
}
