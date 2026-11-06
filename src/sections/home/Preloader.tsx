import { useId, useRef } from 'react'
import { brandSrc } from '@/lib/brand'
import { markPreloaderSeen } from '@/lib/preloader'
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap'
import { EASE, SCENE } from '@/lib/motion-presets'
import { useScrollLock } from '@/hooks/useScrollLock'
import { BRAND_ASPECT } from '@/components/brand/brandAssets'
import { Mascot } from '@/components/mascot/Mascot'

const H = 400
const W = Math.round(H * BRAND_ASPECT.full)
/** Wide liquid shape with a wavy top edge; it rises (y) and rolls sideways (x). */
const WAVE = `M0 14 ${Array.from({ length: 8 }, (_, i) => `q${W / 8} ${i % 2 ? 28 : -28} ${W / 4} 0`).join(' ')} V${H * 2} H0 Z`

/** Logo fills with coffee (wave clip-path) + 0→100 counter → Munchy pops & waves → wipe up. ≤ 1.8s. */
export function Preloader({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null)
  const counter = useRef<HTMLSpanElement>(null)
  const clipId = `mm-fill-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
  useScrollLock(true)

  useGSAP(
    () => {
      const progress = { v: 0 }
      const finish = () => {
        markPreloaderSeen()
        onDone()
        requestAnimationFrame(() => ScrollTrigger.refresh())
      }
      const writeCount = () => {
        if (counter.current) counter.current.textContent = String(Math.round(progress.v))
      }
      const fill = 1.0
      gsap
        .timeline({ onComplete: finish })
        .to(progress, { v: 100, duration: fill, ease: 'power2.inOut', onUpdate: writeCount }, 0)
        .fromTo('[data-wave]', { y: H }, { y: -30, duration: fill, ease: 'power2.inOut' }, 0)
        .fromTo('[data-wave]', { x: 0 }, { x: -W / 2, duration: fill, ease: 'none' }, 0)
        .from('[data-steam] path', { y: 14, opacity: 0, duration: 0.3, stagger: 0.07, ease: EASE.out }, fill - 0.2)
        .fromTo('[data-pop]', { scale: 0, rotate: -20, opacity: 0 }, { scale: 1, rotate: 0, opacity: 1, duration: 0.35, ease: EASE.bouncy }, fill - 0.05)
        .to(root.current, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.45, ease: 'power3.inOut' }, SCENE.preloaderMax - 0.45)
    },
    { scope: root },
  )

  return (
    <div ref={root} className="grain fixed inset-0 z-[95] flex items-center justify-center bg-oat" style={{ clipPath: 'inset(0% 0% 0% 0%)' }} aria-hidden="true">
      <div className="relative flex items-end gap-2">
        <div className="relative">
          <svg data-steam viewBox="0 0 60 40" className="absolute -top-10 left-1/2 h-10 w-16 -translate-x-1/2 fill-none stroke-caramel" strokeWidth="4" strokeLinecap="round">
            <path d="M14 38c-6-8 4-12 0-22" />
            <path d="M30 38c-6-10 6-14 0-30" />
            <path d="M46 38c-6-8 4-12 0-22" />
          </svg>
          <svg viewBox={`0 0 ${W} ${H}`} className="h-[min(46vh,320px)] w-auto">
            <defs>
              <clipPath id={clipId}>
                <path data-wave d={WAVE} />
              </clipPath>
            </defs>
            <image href={brandSrc('full', 512)} width={W} height={H} opacity={0.14} />
            <image href={brandSrc('full', 512)} width={W} height={H} clipPath={`url(#${clipId})`} />
          </svg>
        </div>
        <div data-pop className="-ml-6 mb-2 origin-bottom">
          <Mascot mood="wave" className="h-28 sm:h-36" />
        </div>
      </div>
      <span className="absolute right-5 bottom-5 font-display text-7xl font-extrabold tracking-tighter text-espresso tabular-nums sm:text-9xl">
        <span ref={counter}>0</span>
        <span className="text-chili">%</span>
      </span>
    </div>
  )
}
