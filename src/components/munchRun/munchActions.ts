import { gsap } from '@/lib/gsap'
import { EASE, MASCOT, MUNCH_RUN } from '@/lib/motion-presets'

/** DOM handles rendered once by <MunchRun>. Transform layers: outer (x,y) › mid (tilt/spin/stretch) › float (idle y) › act (squash/hops). */
export interface MunchEls {
  outer: HTMLDivElement
  mid: HTMLDivElement
  float: HTMLDivElement
  act: HTMLDivElement
  button: HTMLButtonElement
  svg: SVGSVGElement
  /** Positional per stop (index = stop - 1); null when that stop has no note. */
  notes: (HTMLElement | null)[]
  crumbs: HTMLElement[]
  dust: HTMLElement
  sparkle: HTMLElement
}

const part = (els: MunchEls, name: string) => els.svg.querySelectorAll(`[data-part="${name}"]`)

/** Entrance at Stop 1: squash-bounce pop, eyes open, a little hop. */
export function popIn(els: MunchEls, onDone: () => void) {
  gsap
    .timeline({ onComplete: onDone })
    .fromTo(els.act, { scale: 0, y: 0 }, { scale: 1, duration: MUNCH_RUN.pop, ease: EASE.bouncy })
    .fromTo(part(els, 'eyes'), { scaleY: 0.1 }, { scaleY: 1, duration: 0.25, ease: 'back.out(3)' }, '-=0.15')
    .to(els.act, { y: -14, duration: 0.18, ease: 'power2.out' })
    .to(els.act, { y: 0, duration: 0.4, ease: 'bounce.out' })
}

/** Crouch then launch (stretch) on take-off. */
export function takeoffSquash(els: MunchEls) {
  gsap
    .timeline()
    .to(els.act, { scaleY: 0.78, scaleX: 1.14, transformOrigin: '50% 100%', duration: MUNCH_RUN.takeoff * 0.45, ease: 'power2.out', overwrite: 'auto' })
    .to(els.act, { scaleY: 1.12, scaleX: 0.92, duration: MUNCH_RUN.takeoff * 0.55, ease: 'power2.in' })
    .to(els.act, { scaleY: 1, scaleX: 1, duration: 0.3, ease: EASE.bouncy })
}

/** Landing: squash 0.8 → 1 (bouncy) + a tiny wobble + shadow flash. `clink` = shorter, crisper (coffee). */
export function landSquash(els: MunchEls, clink = false) {
  gsap
    .timeline()
    .fromTo(els.act, { scaleY: clink ? 0.86 : 0.8, scaleX: clink ? 1.1 : 1.16, transformOrigin: '50% 100%' }, { scaleY: 1, scaleX: 1, duration: MUNCH_RUN.land, ease: EASE.bouncy, overwrite: 'auto' })
    .fromTo(els.act, { rotation: -6 }, { rotation: 0, duration: 0.5, ease: 'elastic.out(1, 0.35)' }, 0)
  gsap.fromTo(part(els, 'shadow'), { opacity: 0.28 }, { opacity: 0, duration: 0.6, ease: 'power1.out' })
}

/** Happy hop (cart reaction) with sparkle-ish squinty eyes; bigger when the added item matches the form. */
export function happyHop(els: MunchEls, big: boolean) {
  const h = big ? 30 : 16
  gsap
    .timeline()
    .to(els.act, { y: -h, duration: 0.2, ease: 'power2.out', overwrite: 'auto' })
    .to(els.act, { y: 0, duration: 0.45, ease: 'bounce.out' })
    .fromTo(part(els, 'eyes'), { scaleY: 1 }, { scaleY: 0.35, duration: 0.12, yoyo: true, repeat: 1 }, 0)
}

/** Tap: happy jump, then `then()` (scroll to the Craft tab). */
export function tapJump(els: MunchEls, then: () => void) {
  gsap
    .timeline({ onComplete: then })
    .to(els.act, { y: -26, scaleY: 1.08, duration: MUNCH_RUN.tapJump * 0.4, ease: 'power2.out', overwrite: 'auto' })
    .to(els.act, { y: 0, scaleY: 1, duration: MUNCH_RUN.tapJump * 0.6, ease: 'bounce.out' })
}

/** Parked idle: slow float, random blinks, steam loop (coffee). Returns stop(). */
export function startIdle(els: MunchEls, steam: boolean): () => void {
  const float = gsap.to(els.float, { y: -MUNCH_RUN.floatY, duration: MUNCH_RUN.float, ease: 'sine.inOut', yoyo: true, repeat: -1 })
  const steamEls = els.svg.querySelectorAll('[data-part="steam"] path')
  const steamTween = steam
    ? gsap.fromTo(steamEls, { y: 2, opacity: 0.25 }, { y: -4, opacity: 1, duration: MUNCH_RUN.steam / 2, ease: 'sine.inOut', yoyo: true, repeat: -1, stagger: 0.3 })
    : null
  if (steam) gsap.to(part(els, 'steam'), { opacity: 1, duration: 0.3 })
  let timer = 0
  const blink = () => {
    gsap.to(els.svg.querySelectorAll('[data-part="eye"]'), { scaleY: 0.1, transformOrigin: '50% 60%', duration: MASCOT.blink, yoyo: true, repeat: 1 })
    timer = window.setTimeout(blink, gsap.utils.random(MASCOT.blinkMin, MASCOT.blinkMax) * 1000)
  }
  timer = window.setTimeout(blink, gsap.utils.random(1.5, MASCOT.blinkMax) * 1000)
  return () => {
    window.clearTimeout(timer)
    float.kill()
    steamTween?.kill()
    gsap.to(els.float, { y: 0, duration: 0.2 })
    gsap.to(part(els, 'steam'), { opacity: 0, duration: 0.2 })
  }
}

/** Dizzy eyes for MUNCH_RUN.dizzy seconds (spirals spin, pupils hidden). */
export function dizzy(els: MunchEls) {
  const pupils = part(els, 'pupils')
  const spirals = part(els, 'spirals')
  gsap
    .timeline()
    .set(pupils, { opacity: 0 })
    .set(spirals, { opacity: 1 })
    .fromTo(els.svg.querySelectorAll('[data-part="spirals"] path'), { rotation: 0, transformOrigin: '50% 50%' }, { rotation: 720, duration: MUNCH_RUN.dizzy, ease: 'none' })
    .set(spirals, { opacity: 0 })
    .set(pupils, { opacity: 1 })
}
