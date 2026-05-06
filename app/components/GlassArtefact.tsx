"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * components/GlassArtefact.tsx
 *
 * The KREO wordmark as a real-time 3D glass sculpture.
 *
 * ─── DEVIATIONS FROM THE BRIEF ──────────────────────────────────────────
 *
 * 1. **R3F instead of vanilla Three.js.** The brief said "stay vanilla
 *    Three.js to match the existing WorldScene.tsx pattern" — but
 *    WorldScene.tsx already uses `@react-three/fiber`. Following the actual
 *    pattern, this component is also R3F. Easier integration, identical
 *    perf, no second canvas needed.
 *
 * 2. **Lives in its own contained Canvas, not the WorldScene canvas.** The
 *    existing WorldScene canvas is full-bleed with `pointer-events: none`
 *    so HUD nav and CTAs work. To get hover/click on shards we'd need to
 *    flip pointer-events on, which would block every other DOM control
 *    underneath. Worse, the WorldScene camera animates on `kreo:navigate`
 *    — anchoring the artefact there would either fight that camera or
 *    require a screen-space hack inside a moving scene. So the artefact
 *    gets its own small Canvas sized to the hero wordmark slot. The
 *    background canvas keeps doing its job underneath; the wordmark
 *    canvas captures only the events that matter.
 *
 * 3. **Refraction texture is the gradient fallback.** The brief permits
 *    this. A render target backed by an animated gradient that hue-shifts
 *    with scroll. DOM-to-texture would require html2canvas at 2 FPS and
 *    a per-frame texture upload — not worth the perf trade.
 *
 * 4. **Sanity field mapping.** Brief expects `accentColour`,
 *    `completedDate`, `client`, `scope` — none of which exist on the
 *    actual project schema. See lib/voronoi.ts for the real mapping.
 *
 * ─── INTERACTION ────────────────────────────────────────────────────────
 *
 * - Cursor light: tracks pointer NDC, intensity/tint LERP with velocity
 * - Hover: ray hits handled by R3F's onPointerOver/Out per mesh
 * - Click: scroll to #project-{slug} or to the projects section
 * - Mobile: pointer events disabled, scroll metamorphosis frozen on hero,
 *   point light removed, materials simplified
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";

import {
  buildVoronoiShards,
  disposeShards,
  type ProjectMeta,
  type ShardData,
  type ShardTransform,
} from "@/lib/voronoi";
import { makeScalar, stepScalar } from "@/lib/spring";

/* ─── Types ─────────────────────────────────────────────────────────────── */

type Props = {
  projects: ProjectMeta[];
  /** Path to the wordmark silhouette image. Defaults to /logos/kreo-black-crop.png. */
  silhouetteSrc?: string;
  /** Called when a shard is clicked, receiving the slug or null. */
  onShardClick?: (slug: string | null) => void;
  /** Called whenever the hovered shard changes (for tooltip rendering in DOM). */
  onShardHover?: (info: { title: string | null; subtitle: string | null; x: number; y: number } | null) => void;
};

/* ─── Tunables ──────────────────────────────────────────────────────────── */

const ARTEFACT_WIDTH = 12;          // world-space width of the wordmark
const ARTEFACT_HEIGHT = 3;          // world-space height
const ARTEFACT_DEPTH = 0.15;        // shard extrude depth
const LOAD_DURATION = 1.8;          // seconds for load animation

const BREATHE_AMOUNT_ROT = Math.PI / 90;  // ±2°
const BREATHE_AMOUNT_SCALE = 0.03;        // ±3%
const BREATHE_AMOUNT_Z = 0.05;            // ±0.05 units

const POINT_LIGHT_DISTANCE = 8;
const POINT_LIGHT_DECAY = 2;
const POINT_LIGHT_BASE_INTENSITY = 1.5;
const POINT_LIGHT_FAST_INTENSITY = 3.5;

/* ─── Component ─────────────────────────────────────────────────────────── */

export default function GlassArtefact({
  projects,
  silhouetteSrc = "/logos/kreo-black-crop.png",
  onShardClick,
  onShardHover,
}: Props) {
  const groupRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const ambientRef = useRef<THREE.AmbientLight>(null);
  const meshGroupRef = useRef<THREE.Group>(null);

  const [shards, setShards] = useState<ShardData[] | null>(null);
  const [isMobile] = useState<boolean>(() => detectMobile());

  const { pointer } = useThree();

  // ─── Build shards once on mount ──────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    let built: ShardData[] | null = null;

    buildVoronoiShards({
      silhouetteSrc,
      width: ARTEFACT_WIDTH,
      height: ARTEFACT_HEIGHT,
      depth: ARTEFACT_DEPTH,
      shardCount: isMobile ? 50 : 95,
      relaxIterations: 3,
      projects,
    })
      .then((s) => {
        if (cancelled) {
          disposeShards(s);
          return;
        }
        built = s;
        setShards(s);
      })
      .catch((err) => {
        // Non-fatal: log and let the page render without the artefact rather
        // than crash the whole hero.
        // eslint-disable-next-line no-console
        console.warn("[GlassArtefact] Failed to build shards", err);
      });

    return () => {
      cancelled = true;
      if (built) disposeShards(built);
    };
  }, [projects, silhouetteSrc, isMobile]);

  // ─── Per-shard live state (springs + identity) ───────────────────────
  const live = useMemo(() => {
    if (!shards) return null;
    return shards.map((s) => ({
      shard: s,
      px: makeScalar(s.scatter.position[0]),
      py: makeScalar(s.scatter.position[1]),
      pz: makeScalar(s.scatter.position[2]),
      rot: makeScalar(s.scatter.rotation),
      scale: makeScalar(s.scatter.scale),
      opacity: makeScalar(s.scatter.opacity),
      // Per-shard breathing phase keeps idle motion from being synced.
      phase: Math.random() * Math.PI * 2,
    }));
  }, [shards]);

  // Per-shard mesh refs so we can mutate transform in useFrame without
  // re-rendering React on every frame.
  const meshRefs = useRef<THREE.Mesh[]>([]);
  const edgeRefs = useRef<THREE.LineSegments[]>([]);
  const materialRefs = useRef<THREE.MeshPhysicalMaterial[]>([]);

  // ─── Animation state held in refs (avoids re-renders) ────────────────
  const animState = useRef({
    elapsed: 0,
    loadT: 0,            // 0..1 over LOAD_DURATION
    scrollProgress: 0,   // 0..1 across the document
    cursor: {
      x: 0,
      y: 0,
      lastX: 0,
      lastY: 0,
      velocity: 0,
    },
    lightIntensity: makeScalar(POINT_LIGHT_BASE_INTENSITY),
    lightHueWarmth: makeScalar(0), // -1=cool, 1=warm
    activeShardIndex: -1 as number,
  });

  // ─── Scroll listener ─────────────────────────────────────────────────
  useEffect(() => {
    if (isMobile) return; // scroll metamorphosis disabled on mobile
    const onScroll = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      animState.current.scrollProgress = Math.max(0, Math.min(1, window.scrollY / max));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isMobile]);

  // ─── Cursor velocity tracking ────────────────────────────────────────
  useEffect(() => {
    if (isMobile) return;
    const onMove = (e: MouseEvent) => {
      const cs = animState.current.cursor;
      const dx = e.clientX - cs.lastX;
      const dy = e.clientY - cs.lastY;
      cs.velocity = Math.hypot(dx, dy);
      cs.lastX = e.clientX;
      cs.lastY = e.clientY;
      cs.x = e.clientX;
      cs.y = e.clientY;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [isMobile]);

  // ─── Click handler — scroll to project ───────────────────────────────
  const handleClick = useCallback(
    (slug: string | null) => {
      if (onShardClick) onShardClick(slug);
      if (!slug) return;

      // Try a project-specific anchor first, then fall back to the
      // Projects section.
      const target =
        document.getElementById(`project-${slug}`) ??
        document.getElementById("projects");
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    [onShardClick],
  );

  // ─── Hover handler — emit tooltip info to parent DOM ─────────────────
  const handleHover = useCallback(
    (i: number, screenX: number, screenY: number) => {
      if (!shards || isMobile) return;
      const s = shards[i];
      animState.current.activeShardIndex = i;
      if (onShardHover && s.projectTitle) {
        onShardHover({
          title: s.projectTitle,
          subtitle: s.projectSubtitle,
          x: screenX,
          y: screenY,
        });
      }
    },
    [shards, onShardHover, isMobile],
  );

  const handleHoverEnd = useCallback(
    (i: number) => {
      if (animState.current.activeShardIndex === i) {
        animState.current.activeShardIndex = -1;
        if (onShardHover) onShardHover(null);
      }
    },
    [onShardHover],
  );

  // ─── Frame loop ──────────────────────────────────────────────────────
  useFrame((_, dt) => {
    if (!groupRef.current) return;
    const a = animState.current;
    a.elapsed += dt;

    if (!live) return;

    // 2. Load progression
    a.loadT = Math.min(1, a.loadT + dt / LOAD_DURATION);

    // 3. Scroll-driven section target (skipped on mobile)
    const sectionTargetForShard = (s: ShardData): ShardTransform =>
      isMobile ? s.states.hero : targetForScroll(a.scrollProgress, s.states);

    // 4. Update each shard's springs and apply to mesh
    for (let i = 0; i < live.length; i++) {
      const l = live[i];
      const mesh = meshRefs.current[i];
      const edges = edgeRefs.current[i];
      const mat = materialRefs.current[i];
      if (!mesh) continue;

      // Determine target transform — interpolate scatter→hero during load,
      // then track scroll-state once load is done.
      const sectionTarget = sectionTargetForShard(l.shard);
      const stagger = staggerForShard(i, live.length);
      const localLoad = Math.max(0, Math.min(1, (a.loadT - stagger) / (1 - stagger)));
      const eased = easeOutCubic(localLoad);

      // Blend scatter (start) toward sectionTarget by `eased`.
      const tx = lerp(l.shard.scatter.position[0], sectionTarget.position[0], eased);
      const ty = lerp(l.shard.scatter.position[1], sectionTarget.position[1], eased);
      const tz = lerp(l.shard.scatter.position[2], sectionTarget.position[2], eased);
      const tr = lerp(l.shard.scatter.rotation, sectionTarget.rotation, eased);
      const ts = lerp(l.shard.scatter.scale, sectionTarget.scale, eased);
      const to = lerp(l.shard.scatter.opacity, sectionTarget.opacity, eased);

      // Idle breathing (post-load, attenuated by load eased so it ramps in).
      const breatheT = a.elapsed * 0.55 + l.phase;
      const breathe =
        Math.sin(breatheT) * Math.cos(breatheT * 0.71 + l.shard.index * 0.23);
      const bRot = breathe * BREATHE_AMOUNT_ROT * eased;
      const bScale = breathe * BREATHE_AMOUNT_SCALE * eased;
      const bZ = breathe * BREATHE_AMOUNT_Z * eased;

      // Step springs
      stepScalar(l.px, tx, dt);
      stepScalar(l.py, ty, dt);
      stepScalar(l.pz, tz + bZ, dt);
      stepScalar(l.rot, tr + bRot, dt);
      stepScalar(l.scale, ts * (1 + bScale), dt);
      stepScalar(l.opacity, to, dt, 60, 12);

      // Apply
      mesh.position.set(l.px.x, l.py.x, l.pz.x);
      mesh.rotation.z = l.rot.x;
      mesh.scale.setScalar(l.scale.x);
      mesh.visible = l.opacity.x > 0.02;

      if (mat) {
        mat.opacity = l.opacity.x;

        // Hover boost
        const isActive = a.activeShardIndex === i;
        const targetTransmission = isActive ? 1.0 : 0.95;
        const targetIor = isActive ? 2.4 : l.shard.ior;
        mat.transmission = lerpScalar(mat.transmission, targetTransmission, dt * 8);
        mat.ior = lerpScalar(mat.ior, targetIor, dt * 8);
      }

      if (edges) {
        edges.position.copy(mesh.position);
        edges.rotation.copy(mesh.rotation);
        edges.scale.copy(mesh.scale);
        edges.visible = mesh.visible && l.opacity.x > 0.4;
      }
    }

    // 5. Cursor light
    if (!isMobile && lightRef.current) {
      // Map pointer NDC to a position in the artefact's local plane (z=0).
      // Aspect-correct so the mapping feels 1:1 with the wordmark width.
      const lx = pointer.x * (ARTEFACT_WIDTH / 2);
      const ly = pointer.y * (ARTEFACT_HEIGHT / 2 + 0.5);
      lightRef.current.position.set(lx, ly, 1.0);

      // Cursor velocity → intensity & warmth
      const v = a.cursor.velocity;
      // Decay velocity each frame so still cursors trend cool.
      a.cursor.velocity *= 0.85;

      const targetIntensity = v > 4
        ? POINT_LIGHT_FAST_INTENSITY
        : POINT_LIGHT_BASE_INTENSITY;
      const targetWarmth = v > 4 ? 1 : -1;

      stepScalar(a.lightIntensity, targetIntensity, dt, 50, 14);
      stepScalar(a.lightHueWarmth, targetWarmth, dt, 30, 10);

      lightRef.current.intensity = a.lightIntensity.x;
      lightRef.current.color.setRGB(
        ...warmthToRGB(a.lightHueWarmth.x),
      );
    }

    // 6. Global palette tint — bias the ambient light's color toward the
    //    current section's brand colour. Cheaper than mutating ~95
    //    materials per frame; visually reads as a section-mood shift.
    const [tr, tg, tb] = paletteForScroll(a.scrollProgress);
    if (ambientRef.current) {
      // Soft mix toward the tint so it never overwhelms the glass colour.
      ambientRef.current.color.setRGB(
        0.7 + tr * 0.3,
        0.7 + tg * 0.3,
        0.7 + tb * 0.3,
      );
    }
  });

  // Reset hover state if the active shard suddenly disappears.
  useEffect(() => {
    if (!shards) animState.current.activeShardIndex = -1;
  }, [shards]);

  /* ─── Render ────────────────────────────────────────────────────────── */

  if (!shards || !live) {
    // Nothing yet — keep the canvas alive but render no artefact.
    return null;
  }

  return (
    <group ref={groupRef}>
      {/* Cursor point light — desktop only */}
      {!isMobile && (
        <pointLight
          ref={lightRef}
          position={[0, 0, 1]}
          intensity={POINT_LIGHT_BASE_INTENSITY}
          distance={POINT_LIGHT_DISTANCE}
          decay={POINT_LIGHT_DECAY}
          color={0xe0f0ff}
        />
      )}

      {/* A faint fill light so unlit shards still pick up some shape.
          Its colour is mixed each frame toward the active section's tint. */}
      <ambientLight ref={ambientRef} intensity={0.45} />

      {/* Shard meshes */}
      <group ref={meshGroupRef}>
        {shards.map((s, i) => (
          <mesh
            key={s.index}
            ref={(el) => {
              if (el) meshRefs.current[i] = el;
            }}
            geometry={s.geometry}
            position={s.scatter.position}
            rotation={[0, 0, s.scatter.rotation]}
            scale={s.scatter.scale}
            onPointerOver={
              isMobile
                ? undefined
                : (e) => {
                    e.stopPropagation();
                    handleHover(i, (e as any).clientX ?? 0, (e as any).clientY ?? 0);
                  }
            }
            onPointerMove={
              isMobile
                ? undefined
                : (e) => {
                    if (animState.current.activeShardIndex === i) {
                      handleHover(i, (e as any).clientX ?? 0, (e as any).clientY ?? 0);
                    }
                  }
            }
            onPointerOut={isMobile ? undefined : () => handleHoverEnd(i)}
            onClick={
              isMobile
                ? undefined
                : (e) => {
                    e.stopPropagation();
                    handleClick(s.projectSlug);
                  }
            }
          >
            <meshPhysicalMaterial
              ref={(el) => {
                if (el) materialRefs.current[i] = el;
              }}
              transparent
              opacity={s.scatter.opacity}
              color={s.baseColor}
              roughness={0.05}
              metalness={0}
              transmission={isMobile ? 0.85 : 0.95}
              thickness={0.5}
              ior={s.ior}
              attenuationColor={s.baseColor}
              attenuationDistance={3.0}
              clearcoat={isMobile ? 0 : 1.0}
              clearcoatRoughness={0.1}
              envMapIntensity={1.0}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
      </group>

      {/* Edge lines — desktop only (cheap but additive draw calls) */}
      {!isMobile && (
        <group>
          {shards.map((s, i) => (
            <lineSegments
              key={`e-${s.index}`}
              ref={(el) => {
                if (el) edgeRefs.current[i] = el as THREE.LineSegments;
              }}
              geometry={s.edgesGeometry}
              position={s.scatter.position}
              rotation={[0, 0, s.scatter.rotation]}
              scale={s.scatter.scale}
            >
              <lineBasicMaterial color={0x0d0d0d} transparent opacity={0.55} />
            </lineSegments>
          ))}
        </group>
      )}
    </group>
  );
}

/* ─── Helpers ───────────────────────────────────────────────────────────── */

function detectMobile(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(pointer: coarse)").matches) return true;
  if (window.innerWidth < 720) return true;
  return false;
}

function staggerForShard(i: number, total: number): number {
  // Outer shards (later in area-sorted order) start sooner; the largest /
  // most central ones (earliest in the order) arrive last. The brief asks for
  // an implosion feel. Stagger window: 0..0.55.
  return (1 - i / Math.max(1, total - 1)) * 0.55;
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - Math.max(0, Math.min(1, t)), 3);
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function lerpScalar(a: number, b: number, t: number): number {
  return a + (b - a) * Math.max(0, Math.min(1, t));
}

function lerpTransform(a: ShardTransform, b: ShardTransform, t: number): ShardTransform {
  return {
    position: [
      lerp(a.position[0], b.position[0], t),
      lerp(a.position[1], b.position[1], t),
      lerp(a.position[2], b.position[2], t),
    ],
    rotation: lerp(a.rotation, b.rotation, t),
    scale: lerp(a.scale, b.scale, t),
    opacity: lerp(a.opacity, b.opacity, t),
  };
}

/**
 * Map a normalised scroll position (0..1) to a per-shard transform target,
 * blending between named scroll states.
 *
 * Section anchors (mirroring the brief):
 *   0.00–0.15 hero
 *   0.15–0.40 hero → projects
 *   0.40–0.55 projects → about
 *   0.55–0.70 about → pricing
 *   0.70–0.85 pricing
 *   0.85–1.00 pricing → contact
 */
function targetForScroll(
  p: number,
  states: ShardData["states"],
): ShardTransform {
  if (p < 0.15) return states.hero;
  if (p < 0.40) return lerpTransform(states.hero, states.projects, (p - 0.15) / 0.25);
  if (p < 0.55) return lerpTransform(states.projects, states.about, (p - 0.40) / 0.15);
  if (p < 0.70) return lerpTransform(states.about, states.pricing, (p - 0.55) / 0.15);
  if (p < 0.85) return states.pricing;
  return lerpTransform(states.pricing, states.contact, Math.min(1, (p - 0.85) / 0.15));
}

/**
 * Brand palette that shifts as the user scrolls.
 * Returns an [r, g, b] tuple in 0..1.
 */
function paletteForScroll(p: number): [number, number, number] {
  // Anchor stops for hero / projects / about / pricing / contact.
  const stops: Array<{ at: number; hex: string }> = [
    { at: 0.00, hex: "#F5C100" }, // yellow
    { at: 0.25, hex: "#00B6A3" }, // teal
    { at: 0.50, hex: "#2DBA72" }, // green
    { at: 0.75, hex: "#1E6FE0" }, // blue
    { at: 1.00, hex: "#F2ECE3" }, // cream
  ];
  for (let i = 0; i < stops.length - 1; i++) {
    const a = stops[i], b = stops[i + 1];
    if (p <= b.at) {
      const t = (p - a.at) / (b.at - a.at);
      return mixHex(a.hex, b.hex, t);
    }
  }
  return mixHex(stops[stops.length - 1].hex, stops[stops.length - 1].hex, 0);
}

function mixHex(a: string, b: string, t: number): [number, number, number] {
  const ar = parseInt(a.slice(1, 3), 16) / 255;
  const ag = parseInt(a.slice(3, 5), 16) / 255;
  const ab = parseInt(a.slice(5, 7), 16) / 255;
  const br = parseInt(b.slice(1, 3), 16) / 255;
  const bg = parseInt(b.slice(3, 5), 16) / 255;
  const bb = parseInt(b.slice(5, 7), 16) / 255;
  return [ar + (br - ar) * t, ag + (bg - ag) * t, ab + (bb - ab) * t];
}

/**
 * Cursor-velocity warmth → light RGB.
 * warmth -1 = cool (#e0f0ff), +1 = warm (#fff4e0), 0 = white.
 */
function warmthToRGB(warmth: number): [number, number, number] {
  const w = Math.max(-1, Math.min(1, warmth));
  if (w >= 0) {
    // 0 → white, 1 → warm
    return [
      1.0,
      lerp(1.0, 244 / 255, w),
      lerp(1.0, 224 / 255, w),
    ];
  }
  // 0 → white, -1 → cool
  const c = -w;
  return [
    lerp(1.0, 224 / 255, c),
    lerp(1.0, 240 / 255, c),
    1.0,
  ];
}
