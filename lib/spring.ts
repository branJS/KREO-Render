/**
 * lib/spring.ts
 *
 * Shared damped-spring integrator used by:
 *   - GlassArtefact load animation (shards flying inward)
 *   - GlassArtefact scroll metamorphosis (LERPing between tessellation states)
 *   - Cursor light intensity / tint smoothing
 *
 * Equations of motion:
 *   acceleration = -k * (x - target) - damping * v
 *   v += acceleration * dt
 *   x += v * dt
 *
 * Stiffer k = snappier, damping must rise with k to stay critically damped.
 * Default k=80 / damping=14 lands roughly critically damped — overshoots are tiny.
 */

export type SpringScalar = { x: number; v: number };

export type SpringVec3 = {
  x: SpringScalar;
  y: SpringScalar;
  z: SpringScalar;
};

/** Step a scalar spring toward `target`. Mutates and returns `state`. */
export function stepScalar(
  state: SpringScalar,
  target: number,
  dt: number,
  k = 80,
  damping = 14,
): SpringScalar {
  // Clamp dt so a backgrounded tab doesn't unleash the spring.
  const cappedDt = Math.min(dt, 1 / 30);
  const dx = state.x - target;
  const accel = -k * dx - damping * state.v;
  state.v += accel * cappedDt;
  state.x += state.v * cappedDt;
  return state;
}

/** Step a 3-component spring toward `[tx, ty, tz]`. Mutates and returns `state`. */
export function stepVec3(
  state: SpringVec3,
  tx: number,
  ty: number,
  tz: number,
  dt: number,
  k = 80,
  damping = 14,
): SpringVec3 {
  stepScalar(state.x, tx, dt, k, damping);
  stepScalar(state.y, ty, dt, k, damping);
  stepScalar(state.z, tz, dt, k, damping);
  return state;
}

/** Allocate a scalar spring at rest at `x`. */
export function makeScalar(x = 0): SpringScalar {
  return { x, v: 0 };
}

/** Allocate a 3-component spring at rest at `[x, y, z]`. */
export function makeVec3(x = 0, y = 0, z = 0): SpringVec3 {
  return {
    x: { x, v: 0 },
    y: { x: y, v: 0 },
    z: { x: z, v: 0 },
  };
}

/** True when the spring is essentially at the target. Useful for animation hand-off. */
export function isSettled(state: SpringScalar, target: number, eps = 1e-3): boolean {
  return Math.abs(state.x - target) < eps && Math.abs(state.v) < eps;
}
