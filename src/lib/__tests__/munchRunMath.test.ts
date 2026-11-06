import { describe, expect, it } from 'vitest'
import {
  bump,
  controlPoint,
  parkedStop,
  quadPoint,
  quadTangent,
  segmentProgress,
  segmentRange,
  smoothToward,
  spinAngle,
  splitProgress,
  stretchFromVelocity,
  tiltFromTangent,
} from '@/components/munchRun/munchRunMath'

describe('segment progress', () => {
  it('first segment never starts before scroll 0', () => {
    expect(segmentRange(150, 1500, 250, 250, true)).toEqual({ start: 0, end: 1250 })
    expect(segmentRange(800, 1500, 250, 250, true)).toEqual({ start: 550, end: 1250 })
  })
  it('later segments start when the from-anchor rises to the departure line', () => {
    expect(segmentRange(1500, 2600, 250, 250, false)).toEqual({ start: 1250, end: 2350 })
    // departure line above the landing line → the previous stop gets a dwell of (land - depart) px
    expect(segmentRange(1500, 2600, 50, 250, false)).toEqual({ start: 1450, end: 2350 })
  })
  it('progress is clamped 0..1 and linear in between', () => {
    const r = { start: 100, end: 300 }
    expect(segmentProgress(0, r)).toBe(0)
    expect(segmentProgress(200, r)).toBe(0.5)
    expect(segmentProgress(999, r)).toBe(1)
  })
  it('degenerate ranges never divide by zero', () => {
    const r = segmentRange(500, 400, 100, 100, false)
    expect(r.end).toBeGreaterThan(r.start)
    expect(Number.isFinite(segmentProgress(450, r))).toBe(true)
  })
  it('splits journey progress into segment + local', () => {
    expect(splitProgress(0.25)).toEqual({ seg: 0, local: 0.25 })
    expect(splitProgress(1)).toEqual({ seg: 0, local: 1 })
    expect(splitProgress(1.5)).toEqual({ seg: 1, local: 0.5 })
    expect(splitProgress(3)).toEqual({ seg: 1, local: 1 })
  })
  it('parks only near a stop', () => {
    expect(parkedStop(0.002, 0.004)).toBe(0)
    expect(parkedStop(1.003, 0.004)).toBe(1)
    expect(parkedStop(1.5, 0.004)).toBeNull()
  })
})

describe('curve', () => {
  const p0 = { x: 1200, y: 200 }
  const p1 = { x: 100, y: 260 }
  const c = controlPoint(p0, p1, { w: 1440, h: 900 }, 0.5, 0.1)

  it('passes through the anchors at t=0 and t=1', () => {
    expect(quadPoint(p0, c, p1, 0)).toEqual(p0)
    expect(quadPoint(p0, c, p1, 1)).toEqual(p1)
  })
  it('swoops toward the centre and down', () => {
    expect(c.y).toBeGreaterThan((p0.y + p1.y) / 2)
    expect(Math.abs(c.x - 720)).toBeLessThan(Math.abs((p0.x + p1.x) / 2 - 720) + 1e-9)
    const mid = quadPoint(p0, c, p1, 0.5)
    expect(mid.y).toBeGreaterThan(230)
  })
  it('tangent points along the travel direction', () => {
    expect(quadTangent(p0, c, p1, 0.5).x).toBeLessThan(0)
  })
})

describe('rotation', () => {
  it('leans into travel and is clamped to ±max', () => {
    expect(tiltFromTangent({ x: 10, y: 1000 }, 25)).toBe(25)
    expect(tiltFromTangent({ x: -10, y: 1000 }, 25)).toBe(-25)
    expect(tiltFromTangent({ x: 100, y: 0 }, 25)).toBe(0)
    expect(tiltFromTangent({ x: -100, y: 20 }, 25)).toBeLessThan(0)
    expect(tiltFromTangent({ x: 0, y: 0 }, 25)).toBe(0)
  })
  it('spins exactly 360° across the morph window on desktop, wobbles back to 0 on mobile', () => {
    expect(spinAngle(0.2, 0.35, 0.65, false, 1)).toBe(0)
    expect(spinAngle(0.9, 0.35, 0.65, false, 1)).toBe(360)
    expect(spinAngle(0.5, 0.35, 0.65, false, -1)).toBeCloseTo(-180)
    expect(spinAngle(0.9, 0.35, 0.65, true, 1)).toBeCloseTo(0)
    expect(Math.abs(spinAngle(0.5, 0.35, 0.65, true, 1))).toBeGreaterThan(0)
  })
})

describe('feel', () => {
  it('bump peaks mid-window and is 0 outside', () => {
    expect(bump(0.1, 0.2, 0.6)).toBe(0)
    expect(bump(0.4, 0.2, 0.6)).toBeCloseTo(1)
  })
  it('stretch grows with speed but is capped', () => {
    expect(stretchFromVelocity(0, 0.35, 0.22)).toEqual([1, 1])
    expect(stretchFromVelocity(100, 0.35, 0.22)[0]).toBeCloseTo(1.22)
  })
  it('smoothing approaches the target and snaps when close', () => {
    const a = smoothToward(0, 1, 0.12, 1000 / 60)
    expect(a).toBeCloseTo(0.12)
    expect(smoothToward(0.99995, 1, 0.12, 16)).toBe(1)
    // Frame-rate independent: two 30fps steps ≈ four 60fps steps
    let x = 0
    for (let i = 0; i < 4; i++) x = smoothToward(x, 1, 0.12, 1000 / 60)
    let y = 0
    for (let i = 0; i < 2; i++) y = smoothToward(y, 1, 0.12, 1000 / 30)
    expect(y).toBeCloseTo(x)
  })
})
