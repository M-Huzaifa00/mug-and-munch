/**
 * Single place where GSAP + plugins are registered.
 * Every component imports gsap (and plugins) from HERE, never from 'gsap' directly.
 */
import { gsap } from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
import { Draggable } from 'gsap/Draggable'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { Flip } from 'gsap/Flip'
import { InertiaPlugin } from 'gsap/InertiaPlugin'
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import { Observer } from 'gsap/Observer'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(
  useGSAP,
  ScrollTrigger,
  SplitText,
  Flip,
  Draggable,
  InertiaPlugin,
  Observer,
  CustomEase,
  MotionPathPlugin,
  DrawSVGPlugin,
  MorphSVGPlugin,
)

export {
  gsap,
  useGSAP,
  ScrollTrigger,
  SplitText,
  Flip,
  Draggable,
  InertiaPlugin,
  Observer,
  CustomEase,
  MotionPathPlugin,
  DrawSVGPlugin,
  MorphSVGPlugin,
}

let refreshTimer = 0
/** Debounced ScrollTrigger.refresh() — call after images/fonts change layout. */
export function refreshScrollTriggersSoon(delay = 150) {
  window.clearTimeout(refreshTimer)
  refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), delay)
}

/** Media queries used with gsap.matchMedia() so motion respects user prefs. */
export const MQ = {
  motionOk: '(prefers-reduced-motion: no-preference)',
  reduced: '(prefers-reduced-motion: reduce)',
  desktop: '(min-width: 768px)',
  finePointer: '(hover: hover) and (pointer: fine)',
} as const
