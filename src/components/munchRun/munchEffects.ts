import { gsap } from '@/lib/gsap'
import { EASE, MUNCH_RUN } from '@/lib/motion-presets'

/**
 * Small pooled effects for Munch Run. All transform + opacity on elements rendered once by
 * <MunchRun> (no DOM creation per frame).
 */

export interface CrumbPool {
  spawn: (x: number, y: number, kind: 'sesame' | 'herb') => void
}

/** Recycles up to `max` crumbs: each falls a little and fades. */
export function createCrumbPool(els: HTMLElement[], max: number): CrumbPool {
  const pool = els.slice(0, max)
  let i = 0
  return {
    spawn(x, y, kind) {
      const el = pool[i % pool.length]
      i += 1
      if (!el) return
      el.dataset.kind = kind
      gsap.killTweensOf(el)
      gsap.fromTo(
        el,
        { x: x + gsap.utils.random(-8, 8), y, rotation: gsap.utils.random(-60, 60), opacity: 1, scale: 1 },
        { y: y + gsap.utils.random(22, 40), rotation: '+=90', opacity: 0, scale: 0.6, duration: MUNCH_RUN.crumbLife, ease: 'power1.in' },
      )
    },
  }
}

/** Burst a puff group (its children fly outward and fade) centred at x,y (viewport px). */
export function playPuff(group: HTMLElement | null, x: number, y: number, spread = 26) {
  if (!group) return
  const parts = Array.from(group.children) as HTMLElement[]
  gsap.killTweensOf([group, ...parts])
  gsap.set(group, { x, y, autoAlpha: 1 })
  parts.forEach((p, n) => {
    const angle = (n / parts.length) * Math.PI * 2 + gsap.utils.random(-0.4, 0.4)
    gsap.fromTo(
      p,
      { x: 0, y: 0, scale: 0.2, opacity: 1, rotation: 0 },
      { x: Math.cos(angle) * spread, y: Math.sin(angle) * spread * 0.7, scale: 1, opacity: 0, rotation: gsap.utils.random(-90, 90), duration: MUNCH_RUN.puff, ease: EASE.out },
    )
  })
}

/** Show a note: fade/slide in + draw its arrow. */
export function showNote(note: HTMLElement | null) {
  if (!note || note.dataset.shown === '1') return
  note.dataset.shown = '1'
  gsap.killTweensOf(note)
  gsap.fromTo(note, { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: 0.35, ease: EASE.out })
  const paths = note.querySelectorAll('[data-draw]')
  if (paths.length) gsap.fromTo(paths, { drawSVG: '0%' }, { drawSVG: '100%', duration: MUNCH_RUN.noteDraw, ease: EASE.inOut, stagger: 0.25, delay: 0.1 })
}

export function hideNote(note: HTMLElement | null) {
  if (!note || note.dataset.shown !== '1') return
  note.dataset.shown = '0'
  gsap.killTweensOf(note)
  gsap.to(note, { autoAlpha: 0, duration: 0.2 })
}
