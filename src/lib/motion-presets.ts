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
