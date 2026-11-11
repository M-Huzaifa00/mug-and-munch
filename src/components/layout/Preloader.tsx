import { useRef } from 'react'
import { removeBootScreen, setPreloaderPhase, setSketchHandoff, whenPageReady } from '@/lib/preloader'
import { gsap, MQ, ScrollTrigger, useGSAP } from '@/lib/gsap'
import { useScrollLock } from '@/hooks/useScrollLock'
import { SketchArt } from '@/sections/home/hero/SketchArt'

/** Count quickly to here, then hold until the page is mounted. */
const HOLD_AT = 88
/** Never trap a visitor on a slow network: reveal after this even if the page isn't ready (a blank oat page shows). */
const MAX_WAIT_MS = 6000
const FONT_WAIT_MS = 1200

const sleep = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms))

/**
 * THE loading screen, on every full page load (any route). The logo's tray (same art as the hero sketch) draws
 * itself in ink as the count goes 0→100, so the wait builds something. Then:
 * - Home with the hero sketch on screen: the drawing FLIES onto the hero's sketch while the oat fades away, and
 *   the hero prints its colours in (seamless hand-off via `setSketchHandoff`).
 * - anywhere else: the drawing lifts and the curtain slides up (transform only) while the page intro plays.
 * Reduced motion: finished drawing, count, fade.
 */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null)
  const counter = useRef<HTMLSpanElement>(null)
  useScrollLock(true)

  useGSAP(
    (_ctx, contextSafe) => {
      removeBootScreen()
      const calm = window.matchMedia(MQ.reduced).matches
      const run = { cancelled: false }
      const progress = { v: 0 }
      gsap.set(['[data-sk-fill]', '[data-sk-arrow]', '[data-sk-steam]', '[data-sk-spark]', 'text'], { autoAlpha: 0 })
      const draw = gsap.timeline({ paused: true }).fromTo('[data-sk-line]', { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.7, ease: 'power2.inOut', stagger: 0.045 })
      const render = () => {
        if (counter.current) counter.current.textContent = String(Math.round(progress.v))
        draw.progress(calm ? 1 : progress.v / 100)
      }
      render()
      const count = gsap.to(progress, { v: HOLD_AT, duration: 1.1, ease: 'power2.out', onUpdate: render })

      const finish = contextSafe?.(() => {
        if (run.cancelled || !root.current) return
        const target = calm ? null : document.querySelector('[data-hero-sketch] [data-sk-svg]')?.getBoundingClientRect()
        const art = root.current.querySelector('[data-pl-art]')?.getBoundingClientRect()
        const handoff = Boolean(target && art && target.width > 0 && target.top < window.innerHeight * 0.85 && target.bottom > 0)

        const tl = gsap.timeline({
          onComplete: () => {
            setPreloaderPhase('done')
            requestAnimationFrame(() => ScrollTrigger.refresh())
          },
        })
        tl.to(progress, { v: 100, duration: 0.35, ease: 'power1.inOut', onUpdate: render })
        tl.addLabel('exit', '+=0.15').call(
          () => {
            setSketchHandoff(handoff)
            setPreloaderPhase('revealing')
          },
          [],
          'exit',
        )
        if (calm) tl.to(root.current, { autoAlpha: 0, duration: 0.4, ease: 'power1.out' }, 'exit')
        else if (handoff && target && art) {
          tl.to('[data-pl-count]', { y: 24, autoAlpha: 0, duration: 0.3, ease: 'power2.in' }, 'exit')
            .to(
              '[data-pl-art]',
              {
                x: target.left + target.width / 2 - (art.left + art.width / 2),
                y: target.top + target.height / 2 - (art.top + art.height / 2),
                scale: target.width / art.width,
                duration: 0.95,
                ease: 'power3.inOut',
              },
              'exit',
            )
            .to('[data-pl-bg]', { autoAlpha: 0, duration: 0.75, ease: 'power1.out' }, 'exit+=0.15')
        } else {
          tl.to('[data-content]', { y: -70, autoAlpha: 0, duration: 0.45, ease: 'power3.in' }, 'exit').to(root.current, { yPercent: -100, duration: 0.65, ease: 'power3.inOut' }, 'exit+=0.05')
        }
      })

      const fonts = Promise.race([document.fonts?.ready ?? Promise.resolve(), sleep(FONT_WAIT_MS)])
      void Promise.all([count.then(), whenPageReady(MAX_WAIT_MS), fonts]).then(() => finish?.())
      return () => {
        run.cancelled = true
      }
    },
    { scope: root },
  )

  return (
    <div ref={root} className="fixed inset-0 z-[95] overflow-hidden will-change-transform" aria-hidden="true">
      <div data-pl-bg className="grain absolute inset-0 rounded-b-[2.5rem] bg-oat" />
      <div data-content className="relative flex h-full items-center justify-center px-6">
        <div data-pl-art className="w-[min(80vw,34rem)]">
          <SketchArt />
        </div>
      </div>
      <span data-pl-count className="absolute right-5 bottom-5 font-display text-7xl font-extrabold tracking-tighter text-espresso tabular-nums sm:text-9xl">
        <span ref={counter}>0</span>
        <span className="text-chili">%</span>
      </span>
    </div>
  )
}
