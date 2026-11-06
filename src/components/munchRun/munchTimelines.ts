import type { MunchForm } from '@/data/munchRun'
import { gsap } from '@/lib/gsap'
import { MUNCH_RUN } from '@/lib/motion-presets'
import { BODY, BODY_FILL, FACE_Y } from './forms/shapes'

/** Token CSS variable → a colour GSAP can tween (canvas normalises oklch/hex/etc. to #rrggbb or rgb()). */
export function resolveToken(cssVar: string): string {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim()
  const ctx = document.createElement('canvas').getContext('2d')
  if (!ctx || !raw) return raw
  ctx.fillStyle = raw
  return ctx.fillStyle
}

/**
 * Paused morph timeline for one segment (duration 1 = segment progress 0 → 1), driven with
 * tl.progress(local) so scrolling back reverses it exactly. Body morphs between MUNCH_RUN.morphStart/End;
 * details fade+scale around the middle; the face only slides; eyes squeeze shut during the spin.
 */
export function buildSegmentTimeline(svg: SVGSVGElement, from: MunchForm, to: MunchForm): gsap.core.Timeline {
  const q = gsap.utils.selector(svg)
  const a = MUNCH_RUN.morphStart
  const b = MUNCH_RUN.morphEnd
  const mid = (a + b) / 2
  const span = b - a
  // Origins are set ONCE (mixing svgOrigin into only some tween states makes GSAP shift elements to compensate).
  gsap.set(q('[data-part="details"]'), { svgOrigin: '60 60' })
  gsap.set(q('[data-part="eyes"]'), { svgOrigin: '60 44' })
  const tl = gsap.timeline({ paused: true, defaults: { ease: 'none', immediateRender: false } })

  tl.set({}, {}, 1) // pad to duration 1
    .fromTo(q('[data-part="body"]'), { morphSVG: BODY[from] }, { morphSVG: { shape: BODY[to], type: 'rotational' }, duration: span, ease: 'power1.inOut' }, a)
    .fromTo(q('[data-part="fill"]'), { fill: resolveToken(BODY_FILL[from]) }, { fill: resolveToken(BODY_FILL[to]), duration: span }, a)
    .fromTo(q(`[data-part="details"][data-form="${from}"]`), { opacity: 1, scale: 1 }, { opacity: 0, scale: 0.6, duration: span * 0.4 }, a + span * 0.05)
    .fromTo(q(`[data-part="details"][data-form="${to}"]`), { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: span * 0.4 }, mid + span * 0.05)
    .fromTo(q('[data-part="face"]'), { y: FACE_Y[from] }, { y: FACE_Y[to], duration: span * 0.6, ease: 'power1.inOut' }, a + span * 0.2)
    .fromTo(q('[data-part="eyes"]'), { scaleY: 1 }, { scaleY: 0.12, duration: span * 0.15 }, a + span * 0.1)
    .fromTo(q('[data-part="eyes"]'), { scaleY: 0.12 }, { scaleY: 1, duration: span * 0.15, ease: 'back.out(3)' }, b - span * 0.15)
  return tl
}
