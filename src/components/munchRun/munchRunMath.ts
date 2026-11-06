/** Pure maths for Munch Run (no DOM). Unit-tested in src/lib/__tests__/munchRunMath.test.ts. */

export interface Pt {
  x: number
  y: number
}

export const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))
export const clamp01 = (v: number) => clamp(v, 0, 1)
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t
export const smoothstep = (t: number) => {
  const x = clamp01(t)
  return x * x * (3 - 2 * x)
}

/**
 * Scroll positions where a segment starts / ends: the "from" anchor's top crossing the flight line
 * starts it (never before scroll 0 for the first segment), the "to" anchor's top reaching it ends it.
 * Anchor tops are document positions (rect.top + scrollY), read live so pins and resizes stay correct.
 */
export function segmentRange(fromDocTop: number, toDocTop: number, lineY: number, first: boolean): { start: number; end: number } {
  const start = first ? Math.max(0, fromDocTop - lineY) : fromDocTop - lineY
  const end = Math.max(start + 1, toDocTop - lineY)
  return { start, end }
}

export const segmentProgress = (scrollY: number, range: { start: number; end: number }) => clamp01((scrollY - range.start) / (range.end - range.start))

/** Frame-rate independent exponential smoothing (factor tuned for 60fps). */
export const smoothToward = (current: number, target: number, factor60: number, dtMs: number) => {
  const k = 1 - Math.pow(1 - factor60, dtMs / (1000 / 60))
  const next = current + (target - current) * k
  return Math.abs(target - next) < 1e-4 ? target : next
}

/** Control point: swoop toward the page centre and slightly down (a scoop, not a straight diagonal). */
export function controlPoint(p0: Pt, p1: Pt, viewport: { w: number; h: number }, pull: number, drop: number): Pt {
  const mid = { x: (p0.x + p1.x) / 2, y: (p0.y + p1.y) / 2 }
  return { x: mid.x + (viewport.w / 2 - mid.x) * pull, y: mid.y + viewport.h * drop }
}

export function quadPoint(p0: Pt, c: Pt, p1: Pt, t: number): Pt {
  const u = 1 - t
  return { x: u * u * p0.x + 2 * u * t * c.x + t * t * p1.x, y: u * u * p0.y + 2 * u * t * c.y + t * t * p1.y }
}

export function quadTangent(p0: Pt, c: Pt, p1: Pt, t: number): Pt {
  return { x: 2 * (1 - t) * (c.x - p0.x) + 2 * t * (p1.x - c.x), y: 2 * (1 - t) * (c.y - p0.y) + 2 * t * (p1.y - c.y) }
}

/**
 * Tilt (deg) that leans into the direction of travel, clamped: moving right & down → clockwise,
 * moving left & down → counter-clockwise. Mostly-vertical motion never flips the character over.
 */
export function tiltFromTangent(tangent: Pt, max: number): number {
  if (Math.hypot(tangent.x, tangent.y) < 1e-6) return 0
  const deg = (Math.atan2(tangent.y, Math.abs(tangent.x)) * 180) / Math.PI
  return clamp(deg * (tangent.x < 0 ? -1 : 1), -max, max)
}

/** Spin at the morph moment: a full 360° (desktop) or a half-turn out-and-back wobble (mobile). */
export function spinAngle(local: number, from: number, to: number, mobile: boolean, direction: 1 | -1): number {
  const s = smoothstep((local - from) / (to - from))
  return mobile ? Math.sin(Math.PI * s) * 180 * direction * 0.25 : 360 * s * direction
}

/** Sine bump between `from` and `to` (0 outside), peak 1. */
export const bump = (t: number, from: number, to: number) => (t <= from || t >= to ? 0 : Math.sin((Math.PI * (t - from)) / (to - from)))

/** Stretch along travel from progress velocity (per second): [scaleAlong, scaleAcross], volume-ish preserving. */
export function stretchFromVelocity(velocity: number, gain: number, max: number): [number, number] {
  const s = 1 + Math.min(max, Math.abs(velocity) * gain)
  return [s, 1 / Math.sqrt(s)]
}

/** Overall journey progress (0 → 2) → segment index + local progress. */
export function splitProgress(p: number): { seg: 0 | 1; local: number } {
  const c = clamp(p, 0, 2)
  return c <= 1 ? { seg: 0, local: c } : { seg: 1, local: c - 1 }
}

/** Parked at a stop (0, 1 or 2) when progress is within epsilon of it, else null. */
export function parkedStop(p: number, eps: number): 0 | 1 | 2 | null {
  for (const s of [0, 1, 2] as const) if (Math.abs(p - s) <= eps) return s
  return null
}
