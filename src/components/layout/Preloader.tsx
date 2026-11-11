import { useId, useRef } from 'react'
import { brandSrc } from '@/lib/brand'
import { removeBootScreen, setPreloaderPhase, whenHomeReady } from '@/lib/preloader'
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap'
import { EASE } from '@/lib/motion-presets'
import { useScrollLock } from '@/hooks/useScrollLock'
import { BRAND_ASPECT } from '@/components/brand/brandAssets'
import { Mascot } from '@/components/mascot/Mascot'

const H = 400
const W = Math.round(H * BRAND_ASPECT.full)
/** Wide liquid shape with a wavy top edge (period W/4 → shifting x by -W/2 loops seamlessly). */
const WAVE = `M0 14 ${Array.from({ length: 8 }, (_, i) => `q${W / 8} ${i % 2 ? 28 : -28} ${W / 4} 0`).join(' ')} V${H * 2} H0 Z`
/** Count quickly to here, then hold (wave still rolling) until Home is mounted. */
const HOLD_AT = 88
/** Never trap a visitor on a slow network: reveal after this even if Home isn't ready (Suspense takes over). */
const MAX_WAIT_MS = 6000
const FONT_WAIT_MS = 1200

const sleep = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms))

/**
 * First-visit Home preloader, rendered by the app shell (not the lazy Home chunk) so it's the ONLY loading
 * screen: index.html paints the same first frame before JS, this takes over, counts 0→88, waits for Home +
 * fonts, finishes to 100, Munchy pops, then the curtain slides up (transform only) while the hero intro plays.
 */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null)
  const counter = useRef<HTMLSpanElement>(null)
  const clipId = `mm-fill-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
  useScrollLock(true)

  useGSAP(
    (_ctx, contextSafe) => {
      removeBootScreen()
      const run = { cancelled: false }
      const progress = { v: 0 }
      const waveY = gsap.quickSetter('[data-wave]', 'y')
      const render = () => {
        if (counter.current) counter.current.textContent = String(Math.round(progress.v))
        waveY(H - ((H + 30) * progress.v) / 100)
      }
      render()
      gsap.set('[data-steam] path', { y: 14, opacity: 0 })
      gsap.to('[data-wave]', { x: -W / 2, duration: 1.1, ease: 'none', repeat: -1 })
      const count = gsap.to(progress, { v: HOLD_AT, duration: 0.85, ease: 'power2.out', onUpdate: render })

      const finish = contextSafe?.(() => {
        if (run.cancelled) return
        gsap
          .timeline({
            onComplete: () => {
              setPreloaderPhase('done')
              requestAnimationFrame(() => ScrollTrigger.refresh())
            },
          })
          .to(progress, { v: 100, duration: 0.3, ease: 'power1.inOut', onUpdate: render })
          .to('[data-steam] path', { y: 0, opacity: 1, duration: 0.3, stagger: 0.07, ease: EASE.out }, 0.1)
          .fromTo('[data-pop]', { scale: 0, rotation: -20, autoAlpha: 0 }, { scale: 1, rotation: 0, autoAlpha: 1, duration: 0.4, ease: EASE.bouncy }, 0.12)
          .addLabel('exit', '+=0.18')
          .call(() => setPreloaderPhase('revealing'), [], 'exit')
          .to('[data-content]', { y: -70, autoAlpha: 0, duration: 0.45, ease: 'power3.in' }, 'exit')
          .to(root.current, { yPercent: -100, duration: 0.65, ease: 'power3.inOut' }, 'exit+=0.05')
      })

      const fonts = Promise.race([document.fonts?.ready ?? Promise.resolve(), sleep(FONT_WAIT_MS)])
      void Promise.all([count.then(), whenHomeReady(MAX_WAIT_MS), fonts]).then(() => finish?.())
      return () => {
        run.cancelled = true
      }
    },
    { scope: root },
  )

  return (
    <div ref={root} className="grain fixed inset-0 z-[95] overflow-hidden rounded-b-[2.5rem] bg-oat will-change-transform" aria-hidden="true">
      <div data-content className="flex h-full items-center justify-center">
        <div className="relative">
          <svg data-steam viewBox="0 0 60 40" className="absolute -top-10 left-1/2 h-10 w-16 -translate-x-1/2 fill-none stroke-caramel" strokeWidth="4" strokeLinecap="round">
            <path d="M14 38c-6-8 4-12 0-22" />
            <path d="M30 38c-6-10 6-14 0-30" />
            <path d="M46 38c-6-8 4-12 0-22" />
          </svg>
          {/* Same size/position as the static #mm-boot frame in index.html → seamless hand-off. */}
          <svg viewBox={`0 0 ${W} ${H}`} className="h-[min(46vh,320px)] w-auto">
            <defs>
              <clipPath id={clipId}>
                <path data-wave d={WAVE} />
              </clipPath>
            </defs>
            <image href={brandSrc('full', 512)} width={W} height={H} opacity={0.14} />
            <image href={brandSrc('full', 512)} width={W} height={H} clipPath={`url(#${clipId})`} />
          </svg>
          {/* Phones: under the logo (beside it would cover the wordmark). sm+: beside it. */}
          <div className="absolute -bottom-28 left-1/2 -translate-x-1/2 sm:bottom-2 sm:-right-24 sm:left-auto sm:translate-x-0">
            <div data-pop className="invisible origin-bottom">
              <Mascot mood="wave" className="h-24 sm:h-36" />
            </div>
          </div>
        </div>
      </div>
      <span className="absolute right-5 bottom-5 font-display text-7xl font-extrabold tracking-tighter text-espresso tabular-nums sm:text-9xl">
        <span ref={counter}>0</span>
        <span className="text-chili">%</span>
      </span>
    </div>
  )
}
