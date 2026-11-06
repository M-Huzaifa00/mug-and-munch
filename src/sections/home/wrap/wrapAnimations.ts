import { gsap } from '@/lib/gsap'
import { EASE } from '@/lib/motion-presets'
import { TORTILLA_FLAT, TORTILLA_ROLLED } from './WrapStage'

const parts = (stage: Element) => ({
  tortilla: stage.querySelector('[data-tortilla]'),
  spots: stage.querySelector('[data-spots]'),
  fillings: stage.querySelector('[data-fillings]'),
  seams: stage.querySelector('[data-seams]'),
  seamPaths: stage.querySelectorAll('[data-seams] path'),
  frills: stage.querySelector('[data-frills]'),
  frillPaths: stage.querySelectorAll('[data-frills] path'),
  band: stage.querySelector('[data-band]'),
})

/** Final rolled look with no animation (reduced motion). */
export function setRolled(stage: Element) {
  const p = parts(stage)
  gsap.set(p.tortilla, { morphSVG: TORTILLA_ROLLED })
  gsap.set([p.spots, p.fillings], { autoAlpha: 0 })
  gsap.set([p.seams, p.frills, p.band], { autoAlpha: 1 })
}

/** Fillings tuck in, tortilla rolls (MorphSVG), seams draw, frills pop, paper band slides on, little hop. */
export function rollWrap(stage: Element, onComplete: () => void) {
  const p = parts(stage)
  return gsap
    .timeline({ onComplete })
    .to(p.fillings, { scale: 0.45, transformOrigin: '50% 55%', autoAlpha: 0, duration: 0.9, ease: 'power2.in' }, 0)
    .to(p.spots, { autoAlpha: 0, duration: 0.4 }, 0.1)
    .to(p.tortilla, { morphSVG: TORTILLA_ROLLED, duration: 1, ease: 'power2.inOut' }, 0.1)
    .set(p.seams, { autoAlpha: 1 }, 0.95)
    .fromTo(p.seamPaths, { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.5, stagger: 0.15 }, 0.95)
    .set(p.frills, { autoAlpha: 1 }, 1.1)
    .fromTo(p.frillPaths, { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.5, ease: EASE.bouncy, stagger: 0.12 }, 1.1)
    .fromTo(p.band, { x: -260, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.6, ease: EASE.out }, 1.35)
    .to(stage, { y: -14, duration: 0.18, yoyo: true, repeat: 1, ease: 'power1.out' }, 1.95)
}

/** Back to a flat, empty tortilla (call after React has cleared the fillings). */
export function resetWrapScene(stage: Element) {
  const p = parts(stage)
  gsap.set(p.tortilla, { morphSVG: TORTILLA_FLAT })
  gsap.set(p.fillings, { clearProps: 'all' })
  gsap.set(p.spots, { autoAlpha: 1 })
  gsap.set([p.seams, p.frills, p.band], { autoAlpha: 0 })
  gsap.set(p.band, { x: 0 })
}
