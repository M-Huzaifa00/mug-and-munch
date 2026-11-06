/**
 * Shared animation vocabulary. Use these instead of inventing timings per component.
 * GSAP presets = scroll/timelines. MOTION presets = mount/unmount + layout (motion/react).
 */
import type { Transition } from 'motion/react'
import { CustomEase } from './gsap'

/* ---------- GSAP eases ---------- */
CustomEase.create('bouncy', 'M0,0 C0.18,0 0.32,1.32 0.54,1.12 0.7,0.96 0.82,1.02 1,1')
CustomEase.create('squish', 'M0,0 C0.3,0 0.25,1.25 0.5,1.05 0.7,0.92 0.85,1 1,1')
CustomEase.create('snappy', 'M0,0 C0.22,1 0.36,1 1,1')

export const EASE = {
  bouncy: 'bouncy',
  squish: 'squish',
  snappy: 'snappy',
  elastic: 'elastic.out(1, 0.45)',
  out: 'power3.out',
  inOut: 'power2.inOut',
  linear: 'none',
} as const

export const DUR = {
  micro: 0.18,
  fast: 0.35,
  base: 0.6,
  slow: 0.9,
  hero: 1.2,
} as const

export const STAGGER = {
  chars: 0.03,
  words: 0.06,
  cards: 0.1,
} as const

/** Munchy mascot timings (seconds). */
export const MASCOT = {
  bob: 1.6,
  blinkMin: 3,
  blinkMax: 6,
  blink: 0.08,
  steam: 2.2,
  morph: 0.35,
  peekIn: 0.9,
  peekLook: 0.5,
  peekHold: 2.4,
  peekRepeatDelay: 5,
  followRange: 4,
} as const

/** Phase 4 toys (seconds). */
export const TOYS = {
  drop: 0.45,
  squash: 0.08,
  settle: 0.4,
  topple: 0.75,
  pour: 0.9,
  iceDrop: 0.5,
  spinTurns: 6,
  spin: 3.6,
  flip: 0.65,
} as const

/** Munch Run traveler (seconds unless noted). */
export const MUNCH_RUN = {
  /** Per-frame (60fps) lerp of current → target progress: gives the flight weight. */
  lerp: 0.12,
  /** Body morph window within a segment (progress). */
  morphStart: 0.35,
  morphEnd: 0.65,
  maxTilt: 25,
  /** Max stretch along travel + how much progress velocity (per second) maps to it. */
  stretchMax: 0.22,
  stretchGain: 0.35,
  /** "Parked" when this close to a stop (progress). */
  parkEpsilon: 0.004,
  pop: 0.6,
  takeoff: 0.16,
  land: 0.55,
  float: 1.8,
  floatY: 4,
  crumbLife: 0.8,
  puff: 0.5,
  noteDraw: 0.8,
  dizzy: 0.6,
  dizzyCooldown: 5,
  tapJump: 0.42,
  /** How long hero Munchy watches the take-off. */
  lookFor: 1.2,
  steam: 2,
} as const

/** Preloader / page transition timings. */
export const SCENE = {
  preloaderMax: 1.8,
  transition: 0.6,
} as const

/* ---------- Motion (motion/react) transitions ---------- */
export const SPRING: Record<'soft' | 'bouncy' | 'snappy', Transition> = {
  soft: { type: 'spring', stiffness: 260, damping: 30 },
  bouncy: { type: 'spring', stiffness: 420, damping: 18 },
  snappy: { type: 'spring', stiffness: 600, damping: 38 },
}

/** Button press squish (use with whileTap). */
export const TAP_SQUISH = { scale: 0.92, rotate: -1 } as const

export const FADE_UP = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 8 },
} as const
