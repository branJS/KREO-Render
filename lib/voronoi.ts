/**
 * lib/voronoi.ts
 *
 * Build the KREO wordmark glass tessellation:
 *   1. Sample alpha mask of the wordmark image at a working resolution.
 *   2. Generate weighted Voronoi sites within the bounding box.
 *   3. Lloyd-relax for even cell distribution.
 *   4. Cull cells whose centroid lands outside the silhouette.
 *   5. Sort survivors by area, map each to a Sanity project (featured first).
 *   6. Build THREE.ExtrudeGeometry + EdgesGeometry per shard.
 *   7. Pre-compute per-shard transforms for the five scroll states.
 *
 * NOTE on Sanity field mapping (the brief invented field names that don't
 * exist in `sanity/schemas/project.ts`). Mapping used here:
 *   - accentColour ← CAT_COLOR[category]   (matches ProjectsSection.tsx)
 *   - completedDate ← publishedAt          (drives ior)
 *   - scope ← featured ? "large" : "medium"
 *   - tooltip subtitle ← category (uppercased) or first tag
 */

import * as THREE from 'three';
import { Delaunay } from 'd3-delaunay';

/* ─── Types ─────────────────────────────────────────────────────────────── */

export type ProjectMeta = {
  _id: string;
  title: string;
  slug: string | null;
  category: string | null;
  publishedAt: string | null; // ISO date
  featured: boolean;
  tags?: string[] | null;
};

export type ShardTransform = {
  /** World-space centroid (x, y) — origin sits at (0,0,0) of the artefact group. */
  position: [number, number, number];
  /** Z-axis rotation. */
  rotation: number;
  /** Uniform scale multiplier. */
  scale: number;
  /** Opacity multiplier (1 = full glass, 0 = invisible). */
  opacity: number;
};

export type ShardData = {
  index: number;

  // Project mapping (null when surplus cell)
  projectId: string | null;
  projectTitle: string | null;
  projectSubtitle: string | null;
  projectSlug: string | null;

  // Geometries (origin centered on the cell's centroid)
  geometry: THREE.ExtrudeGeometry;
  edgesGeometry: THREE.EdgesGeometry;

  // Visual properties (constant after init)
  baseColor: THREE.Color;
  ior: number;

  // Scattered start state for the load animation
  scatter: ShardTransform;

  // Resting state per scroll section
  states: {
    hero: ShardTransform;
    projects: ShardTransform;
    about: ShardTransform;
    pricing: ShardTransform;
    contact: ShardTransform;
  };
};

export type BuildOptions = {
  /** URL of the silhouette image (must be served from /public). */
  silhouetteSrc: string;
  /** World-space width of the artefact (Three.js units). */
  width: number;
  /** World-space height of the artefact. */
  height: number;
  /** Extrude depth in world units. */
  depth?: number;
  /** Approximate target shard count after culling. The seeded count is higher. */
  shardCount?: number;
  /** Lloyd relaxation passes for even cell distribution. */
  relaxIterations?: number;
  /** Projects from Sanity, in priority order. */
  projects: ProjectMeta[];
};

/* ─── Brand palette mirror (kept here so Voronoi is self-contained) ────── */

const CAT_COLOR: Record<string, string> = {
  branding: '#F5C100',
  motion: '#00B6A3',
  '3d': '#1E6FE0',
  '3d-render': '#1E6FE0',
  print: '#2DBA72',
  digital: '#00B6A3',
  uiux: '#E56BE3',
  'ui-ux': '#E56BE3',
  other: '#E24C3A',
};

const NEUTRAL_COLOR = '#F2ECE3';

/* ─── Public entry point ────────────────────────────────────────────────── */

export async function buildVoronoiShards(opts: BuildOptions): Promise<ShardData[]> {
  const {
    silhouetteSrc,
    width,
    height,
    depth = 0.15,
    shardCount = 90,
    relaxIterations = 3,
    projects,
  } = opts;

  // 1. Sample silhouette alpha into a binary 2D mask.
  const mask = await sampleSilhouetteMask(silhouetteSrc, 512);

  // 2. Seed enough sites that culling leaves us roughly at shardCount.
  //    The mask coverage ratio drives the multiplier.
  const coverage = mask.coverage; // 0..1
  const targetSeed = Math.max(40, Math.round(shardCount / Math.max(coverage, 0.15)));
  const seedPoints = seedPointsInBounds(targetSeed, mask);

  // 3. Lloyd relaxation in mask-space (pixel coords).
  const relaxed = lloydRelax(seedPoints, mask, relaxIterations);

  // 4. Final Voronoi + cull. Survivors keep mask-space positions.
  const cells = extractCells(relaxed, mask);

  // 5. Sort by area descending, map projects in priority order so the most
  //    featured project lands on the largest shard.
  cells.sort((a, b) => b.area - a.area);

  // 6. Convert mask-space coordinates to world-space and build geometries.
  const shards: ShardData[] = cells.map((cell, i) => {
    const project = projects[i] ?? null;

    const worldCentroid = maskToWorld(cell.centroid, mask, width, height);
    const worldPolygon = cell.polygon.map((p) => maskToWorld(p, mask, width, height));

    // Polygon relative to its centroid (so the geometry origin is the centroid).
    const relPolygon = worldPolygon.map(([x, y]) => [x - worldCentroid[0], y - worldCentroid[1]] as [number, number]);

    const shape = new THREE.Shape(relPolygon.map(([x, y]) => new THREE.Vector2(x, y)));
    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth,
      bevelEnabled: true,
      bevelThickness: 0.012,
      bevelSize: 0.012,
      bevelSegments: 1,
      curveSegments: 1,
    });
    // Center extrusion in z so the cell sits on z=0 instead of [0..depth].
    geometry.translate(0, 0, -depth / 2);
    geometry.computeVertexNormals();

    const edgesGeometry = new THREE.EdgesGeometry(geometry, 25);

    // Per-shard visual properties.
    const baseColor = colorForProject(project);
    const ior = iorForProject(project);

    const heroTransform: ShardTransform = {
      position: [worldCentroid[0], worldCentroid[1], 0],
      rotation: 0,
      scale: 1,
      opacity: 1,
    };

    const projectsTransform: ShardTransform = {
      position: [worldCentroid[0] * 1.02, worldCentroid[1] * 1.02, 0.04],
      rotation: 0.04,
      scale: 0.94,
      opacity: 1,
    };

    const aboutTransform: ShardTransform = {
      position: [worldCentroid[0] * 0.78, worldCentroid[1] * 0.78, 0.08],
      rotation: -0.06,
      scale: 0.7,
      opacity: 0.95,
    };

    const pricingTransform = gridSnappedTransform(worldCentroid, width, height, i, cells.length);

    const contactTransform: ShardTransform = {
      position: [worldCentroid[0] * 1.6, worldCentroid[1] * 1.6, -0.5],
      rotation: (Math.random() - 0.5) * 0.6,
      scale: 0.5,
      opacity: 0.3,
    };

    // Scattered start state for load animation: random sphere around the artefact.
    const angle = Math.random() * Math.PI * 2;
    const elevation = (Math.random() - 0.5) * Math.PI;
    const radius = Math.max(width, height) * 0.9 + Math.random() * 1.5;
    const scatter: ShardTransform = {
      position: [
        Math.cos(angle) * Math.cos(elevation) * radius,
        Math.sin(elevation) * radius,
        Math.sin(angle) * Math.cos(elevation) * radius,
      ],
      rotation: (Math.random() - 0.5) * Math.PI * 2,
      scale: 0.3,
      opacity: 0,
    };

    return {
      index: i,
      projectId: project?._id ?? null,
      projectTitle: project?.title ?? null,
      projectSubtitle: projectSubtitle(project),
      projectSlug: project?.slug ?? null,
      geometry,
      edgesGeometry,
      baseColor,
      ior,
      scatter,
      states: {
        hero: heroTransform,
        projects: projectsTransform,
        about: aboutTransform,
        pricing: pricingTransform,
        contact: contactTransform,
      },
    };
  });

  return shards;
}

/* ─── Mask sampling ─────────────────────────────────────────────────────── */

type Mask = {
  width: number;
  height: number;
  data: Uint8Array; // 1 = inside silhouette, 0 = outside
  coverage: number; // ratio of inside pixels
  bounds: { minX: number; minY: number; maxX: number; maxY: number }; // tight bounding box
};

async function sampleSilhouetteMask(src: string, targetW: number): Promise<Mask> {
  const img = await loadImage(src);

  // Render at fixed working resolution while preserving aspect ratio.
  const ratio = img.height / img.width;
  const w = targetW;
  const h = Math.round(targetW * ratio);

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
  ctx.drawImage(img, 0, 0, w, h);
  const { data: rgba } = ctx.getImageData(0, 0, w, h);

  const mask = new Uint8Array(w * h);
  let inside = 0;
  let minX = w, minY = h, maxX = 0, maxY = 0;

  // The KREO wordmark PNG is dark glyphs on a transparent background.
  // We treat any sufficiently dark *or* sufficiently opaque pixel as inside,
  // so the mask works whether the asset has alpha or a flat background.
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      const r = rgba[i], g = rgba[i + 1], b = rgba[i + 2], a = rgba[i + 3];
      const luminance = (r + g + b) / 3;
      const isInside = a > 200 && luminance < 140;
      if (isInside) {
        mask[y * w + x] = 1;
        inside++;
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
  }

  // Fallback: if the heuristic missed (e.g. light background, dark glyphs anti-aliased
  // out), use opacity alone.
  if (inside < 100) {
    inside = 0;
    minX = w; minY = h; maxX = 0; maxY = 0;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = (y * w + x) * 4;
        const a = rgba[i + 3];
        const luminance = (rgba[i] + rgba[i + 1] + rgba[i + 2]) / 3;
        const isInside = a > 80 && luminance < 200;
        mask[y * w + x] = isInside ? 1 : 0;
        if (isInside) {
          inside++;
          if (x < minX) minX = x;
          if (y < minY) minY = y;
          if (x > maxX) maxX = x;
          if (y > maxY) maxY = y;
        }
      }
    }
  }

  return {
    width: w,
    height: h,
    data: mask,
    coverage: inside / (w * h),
    bounds: { minX, minY, maxX, maxY },
  };
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = src;
  });
}

/* ─── Site seeding ──────────────────────────────────────────────────────── */

function seedPointsInBounds(count: number, mask: Mask): [number, number][] {
  const { bounds } = mask;
  const w = bounds.maxX - bounds.minX;
  const h = bounds.maxY - bounds.minY;
  const points: [number, number][] = [];

  // Stratified random — keep distribution from clumping.
  const cols = Math.max(1, Math.ceil(Math.sqrt(count * (w / h))));
  const rows = Math.max(1, Math.ceil(count / cols));

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (points.length >= count) break;
      const px = bounds.minX + ((c + Math.random()) / cols) * w;
      const py = bounds.minY + ((r + Math.random()) / rows) * h;
      // Bias toward inside-silhouette seeds; we still keep some outside ones for
      // bbox stability — they get culled later.
      if (sampleMask(mask, px, py) || Math.random() < 0.15) {
        points.push([px, py]);
      }
    }
  }
  return points;
}

function sampleMask(mask: Mask, x: number, y: number): boolean {
  const xi = Math.max(0, Math.min(mask.width - 1, Math.round(x)));
  const yi = Math.max(0, Math.min(mask.height - 1, Math.round(y)));
  return mask.data[yi * mask.width + xi] === 1;
}

/* ─── Lloyd relaxation ──────────────────────────────────────────────────── */

function lloydRelax(points: [number, number][], mask: Mask, iterations: number): [number, number][] {
  const { bounds } = mask;
  const bbox: [number, number, number, number] = [
    bounds.minX - 4,
    bounds.minY - 4,
    bounds.maxX + 4,
    bounds.maxY + 4,
  ];

  let pts = points.slice();
  for (let i = 0; i < iterations; i++) {
    const delaunay = Delaunay.from(pts);
    const voronoi = delaunay.voronoi(bbox);
    pts = pts.map((_, idx) => {
      const poly = voronoi.cellPolygon(idx);
      if (!poly || poly.length < 3) return pts[idx];
      const c = polygonCentroid(poly);
      // Pull toward centroid; clamp inside bbox.
      return [
        Math.max(bbox[0], Math.min(bbox[2], c[0])),
        Math.max(bbox[1], Math.min(bbox[3], c[1])),
      ];
    });
  }
  return pts;
}

function polygonCentroid(poly: ArrayLike<[number, number] | number[]>): [number, number] {
  let cx = 0, cy = 0, area = 0;
  const n = poly.length;
  for (let i = 0; i < n - 1; i++) {
    const [x0, y0] = poly[i] as [number, number];
    const [x1, y1] = poly[i + 1] as [number, number];
    const cross = x0 * y1 - x1 * y0;
    area += cross;
    cx += (x0 + x1) * cross;
    cy += (y0 + y1) * cross;
  }
  area *= 0.5;
  if (Math.abs(area) < 1e-6) {
    // Degenerate — fall back to vertex average.
    let sx = 0, sy = 0;
    for (let i = 0; i < n - 1; i++) { sx += poly[i][0]; sy += poly[i][1]; }
    return [sx / (n - 1), sy / (n - 1)];
  }
  return [cx / (6 * area), cy / (6 * area)];
}

function polygonArea(poly: [number, number][]): number {
  let area = 0;
  const n = poly.length;
  for (let i = 0; i < n - 1; i++) {
    area += poly[i][0] * poly[i + 1][1] - poly[i + 1][0] * poly[i][1];
  }
  return Math.abs(area * 0.5);
}

/* ─── Cell extraction & culling ─────────────────────────────────────────── */

type RawCell = {
  centroid: [number, number];
  polygon: [number, number][];
  area: number;
};

function extractCells(points: [number, number][], mask: Mask): RawCell[] {
  const { bounds } = mask;
  const bbox: [number, number, number, number] = [
    bounds.minX - 2,
    bounds.minY - 2,
    bounds.maxX + 2,
    bounds.maxY + 2,
  ];

  const delaunay = Delaunay.from(points);
  const voronoi = delaunay.voronoi(bbox);

  const cells: RawCell[] = [];
  for (let i = 0; i < points.length; i++) {
    const poly = voronoi.cellPolygon(i) as [number, number][] | null;
    if (!poly || poly.length < 4) continue; // need 3+ unique vertices + close

    const centroid = polygonCentroid(poly);
    if (!sampleMask(mask, centroid[0], centroid[1])) continue;

    // Clip polygon vertices to the silhouette: any vertex outside is pulled
    // back to the centroid by 35% — keeps cells from poking out the wordmark.
    const clipped = poly.map(([x, y]) => {
      if (sampleMask(mask, x, y)) return [x, y] as [number, number];
      return [
        x + (centroid[0] - x) * 0.35,
        y + (centroid[1] - y) * 0.35,
      ] as [number, number];
    });

    cells.push({
      centroid: [centroid[0], centroid[1]],
      polygon: clipped,
      area: polygonArea(clipped),
    });
  }
  return cells;
}

/* ─── Mask → world coordinate space ─────────────────────────────────────── */

function maskToWorld(
  [px, py]: [number, number],
  mask: Mask,
  worldW: number,
  worldH: number,
): [number, number] {
  // Map mask bounding box to a world rect of size (worldW, worldH) centered on origin.
  const { bounds } = mask;
  const bw = Math.max(1, bounds.maxX - bounds.minX);
  const bh = Math.max(1, bounds.maxY - bounds.minY);
  const u = (px - bounds.minX) / bw;
  const v = (py - bounds.minY) / bh;
  const x = (u - 0.5) * worldW;
  // Flip Y — image coords run top-down, world coords run bottom-up.
  const y = (0.5 - v) * worldH;
  return [x, y];
}

/* ─── Per-project visual derivation ─────────────────────────────────────── */

function colorForProject(project: ProjectMeta | null): THREE.Color {
  if (!project) return new THREE.Color(NEUTRAL_COLOR);
  const cat = (project.category ?? '').toLowerCase();
  const hex = CAT_COLOR[cat] ?? NEUTRAL_COLOR;
  return new THREE.Color(hex);
}

function iorForProject(project: ProjectMeta | null): number {
  // Newer projects refract more (higher ior). Range 1.2 .. 2.0.
  if (!project || !project.publishedAt) return 1.4;
  const published = new Date(project.publishedAt).getTime();
  if (Number.isNaN(published)) return 1.4;
  const ageDays = Math.max(0, (Date.now() - published) / (1000 * 60 * 60 * 24));
  // 0 days → 2.0, 720 days → ~1.2
  const t = Math.max(0, Math.min(1, 1 - ageDays / 720));
  return 1.2 + t * 0.8;
}

function projectSubtitle(project: ProjectMeta | null): string | null {
  if (!project) return null;
  const cat = project.category?.replace(/-/g, ' ').toUpperCase();
  if (cat) return cat;
  if (project.tags && project.tags[0]) return project.tags[0].toUpperCase();
  return null;
}

/* ─── Pricing-state grid snapping ───────────────────────────────────────── */

function gridSnappedTransform(
  worldCentroid: [number, number],
  width: number,
  height: number,
  index: number,
  total: number,
): ShardTransform {
  // Snap index → (col, row) of an aspect-correct grid that fills the bbox.
  const aspect = width / height;
  const cols = Math.max(2, Math.round(Math.sqrt(total * aspect)));
  const rows = Math.max(2, Math.ceil(total / cols));
  const col = index % cols;
  const row = Math.floor(index / cols);
  const cellW = width / cols;
  const cellH = height / rows;
  const gx = -width / 2 + cellW * (col + 0.5);
  const gy = height / 2 - cellH * (row + 0.5);

  // LERP halfway between organic centroid and grid cell so it reads as
  // "structured but recognisable".
  return {
    position: [
      worldCentroid[0] * 0.35 + gx * 0.65,
      worldCentroid[1] * 0.35 + gy * 0.65,
      0.02,
    ],
    rotation: 0,
    scale: 0.86,
    opacity: 1,
  };
}

/* ─── Disposal ──────────────────────────────────────────────────────────── */

export function disposeShards(shards: ShardData[]): void {
  for (const s of shards) {
    s.geometry.dispose();
    s.edgesGeometry.dispose();
  }
}
