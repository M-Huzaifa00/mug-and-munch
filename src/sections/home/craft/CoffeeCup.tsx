import { useEffect, useId, useRef } from 'react'
import { BRAND_INK } from '@/lib/brand'
import { gsap, MQ, useGSAP } from '@/lib/gsap'
import { EASE, TOYS } from '@/lib/motion-presets'
import { useReducedMotion } from '@/hooks/useReducedMotion'

export type CupSize = 's' | 'm' | 'l'

/** Liquid top (viewBox y; rim 70, bottom 300) and cup scale per size. */
const LEVEL: Record<CupSize, number> = { s: 196, m: 150, l: 108 }
const SCALE: Record<CupSize, number> = { s: 0.82, m: 0.92, l: 1 }
const CUP = 'M52 70h156l-18 214c-1 10-8 16-18 16H88c-10 0-17-6-18-16z'
const LIQUID = `M0 0${Array.from({ length: 8 }, (_, i) => `q32.5 ${i % 2 ? 9 : -9} 65 0`).join('')}V260H0z`
/** Empty (drained) liquid position. */
export const CUP_EMPTY_Y = 320

interface CoffeeCupProps {
  size: CupSize
  /** Liquid CSS colour (token-based color-mix). */
  fill: string
  iced: boolean
  /** Syrup / shot drizzle colour class, or null. */
  drizzle: string | null
  whipped: boolean
  /** Hidden tab → loops paused. */
  active: boolean
  /** Increment to play the reset "drain then refill" pour. */
  drainKey: number
}

/** Animated drink: cup grows + pours to level, tint crossfades, steam (hot) / ice + splash (iced), drizzle, whipped swirl. */
export function CoffeeCup({ size, fill, iced, drizzle, whipped, active, drainKey }: CoffeeCupProps) {
  const ref = useRef<SVGSVGElement>(null)
  const first = useRef(true)
  const prevIced = useRef(false)
  const front = useRef(0)
  const loops = useRef<gsap.core.Tween[]>([])
  const reduced = useReducedMotion()
  const clipId = `mm-cup-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`

  // Ambient loops (motion only): rolling wave + steam. Paused while the tab is hidden.
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MQ.motionOk, () => {
        loops.current = [
          gsap.to('[data-wave]', { x: -260, duration: 3, ease: 'none', repeat: -1 }),
          gsap.to('[data-steam] path', { y: -12, opacity: 0.2, duration: 1.4, ease: 'sine.inOut', yoyo: true, repeat: -1, stagger: 0.3 }),
          // Bob = small wobble (rotation), so it never fights the y drop/level tweens.
          gsap.to('[data-ice]', { rotation: 8, transformOrigin: '50% 50%', duration: 1.2, ease: 'sine.inOut', yoyo: true, repeat: -1, stagger: 0.25 }),
        ]
        return () => {
          loops.current = []
        }
      })
    },
    { scope: ref },
  )
  useGSAP(() => loops.current.forEach((t) => (active ? t.resume() : t.pause())), { dependencies: [active], scope: ref })

  // Reset: quick pour-out, then refill to the (possibly new) level.
  const sizeNow = useRef(size)
  useEffect(() => {
    sizeNow.current = size
  }, [size])
  useGSAP(
    () => {
      if (drainKey === 0 || reduced) return
      gsap
        .timeline()
        .to('[data-liquid]', { y: CUP_EMPTY_Y, duration: 0.4, ease: 'power2.in' })
        .to('[data-liquid]', { y: () => LEVEL[sizeNow.current], duration: TOYS.pour, ease: EASE.bouncy }, '+=0.1')
    },
    { dependencies: [drainKey], scope: ref },
  )

  // React to choices.
  useGSAP(
    () => {
      const d = first.current || reduced ? 0 : 1
      first.current = false
      gsap.to('[data-cup]', { scale: SCALE[size], svgOrigin: '130 300', duration: 0.5 * d, ease: EASE.bouncy })
      gsap.to('[data-liquid]', { y: LEVEL[size], duration: TOYS.pour * d, ease: EASE.bouncy, overwrite: 'auto' })

      // Tint: paint the hidden layer with the new colour and crossfade.
      const layers = gsap.utils.toArray<SVGPathElement>('[data-tint]')
      const cur = layers[front.current]
      if (cur && cur.style.fill !== fill) {
        front.current = 1 - front.current
        const next = layers[front.current]
        if (next) {
          next.style.fill = fill
          gsap.to(next, { opacity: 1, duration: 0.6 * d })
          gsap.to(cur, { opacity: 0, duration: 0.6 * d })
        }
      }

      gsap.to('[data-steam]', { autoAlpha: iced ? 0 : 1, duration: 0.4 * d })
      gsap.to('[data-saucer]', { autoAlpha: iced ? 0 : 1, duration: 0.3 * d })
      gsap.to('[data-glass]', { opacity: iced ? 0.45 : 1, duration: 0.4 * d })
      gsap.to('[data-whip]', { scale: whipped ? 1 : 0, svgOrigin: '130 70', autoAlpha: whipped ? 1 : 0, duration: 0.45 * d, ease: EASE.bouncy })
      gsap.to('[data-drizzle]', { autoAlpha: drizzle ? 1 : 0, duration: 0.2 * d })
      if (drizzle && d) gsap.fromTo('[data-drizzle]', { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.7, ease: 'power1.in' })

      const justIced = iced && !prevIced.current
      prevIced.current = iced
      const iceY = (i: number) => LEVEL[size] - 18 + (i % 2) * 8
      if (iced && justIced && d) {
        gsap.fromTo('[data-ice]', { y: -200, autoAlpha: 1 }, { y: iceY, duration: TOYS.iceDrop, ease: 'bounce.out', stagger: 0.14 })
        gsap.set('[data-splash]', { y: LEVEL[size] })
        gsap.fromTo('[data-splash] circle', { x: 0, y: 0, scale: 1, autoAlpha: 1 }, { x: (i: number) => (i - 2.5) * 22, y: () => -40 - Math.random() * 40, scale: 0.3, autoAlpha: 0, duration: 0.6, ease: 'power2.out', delay: TOYS.iceDrop * 0.7 })
      } else if (iced) {
        gsap.to('[data-ice]', { y: iceY, autoAlpha: 1, duration: TOYS.pour * d, ease: EASE.bouncy })
      } else {
        gsap.to('[data-ice]', { autoAlpha: 0, y: -60, duration: 0.3 * d })
      }
    },
    { scope: ref, dependencies: [size, fill, iced, drizzle, whipped, reduced] },
  )

  return (
    <svg ref={ref} viewBox="0 0 260 330" className="h-full w-auto overflow-visible" style={{ color: BRAND_INK }} aria-hidden="true">
      <defs>
        <clipPath id={clipId}>
          <path d={CUP} />
        </clipPath>
      </defs>
      <ellipse data-saucer cx="130" cy="306" rx="112" ry="16" className="fill-oat" stroke="currentColor" strokeWidth="6" />
      <g data-cup>
        <g data-steam fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round">
          <path d="M104 52c-10-10 6-16-2-30" />
          <path d="M130 50c-10-12 8-18-1-36" />
          <path d="M156 52c-10-10 6-16-2-30" />
        </g>
        <path data-glass d={CUP} className="fill-oat" />
        <g clipPath={`url(#${clipId})`}>
          <g data-liquid transform={`translate(0 ${LEVEL[size]})`}>
            <g data-wave>
              <path data-tint d={LIQUID} style={{ fill }} />
              <path data-tint d={LIQUID} style={{ fill, opacity: 0 }} />
            </g>
          </g>
          <path data-drizzle d="M74 90c10 40-8 70 6 110s-6 60 4 90" fill="none" className={drizzle ?? 'stroke-caramel'} strokeWidth="8" strokeLinecap="round" style={{ visibility: 'hidden' }} />
        </g>
        {[86, 128, 168].map((x) => (
          <rect key={x} data-ice x={x} y={0} width="30" height="30" rx="7" className="fill-oat/80" stroke="currentColor" strokeWidth="4" style={{ visibility: 'hidden' }} />
        ))}
        <path data-whip d="M78 72c0-18 14-24 22-20 2-14 22-20 30-8 8-10 28-6 30 8 10-2 22 6 22 20z" className="fill-oat" stroke="currentColor" strokeWidth="5" strokeLinejoin="round" style={{ visibility: 'hidden' }} />
        <path d={CUP} fill="none" stroke="currentColor" strokeWidth="6" strokeLinejoin="round" />
        <path d="M206 112c40-4 42 70 2 74" fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
        <g data-splash className="fill-caramel">
          {Array.from({ length: 6 }, (_, i) => (
            <circle key={i} cx="130" cy="0" r="5" style={{ visibility: 'hidden' }} />
          ))}
        </g>
      </g>
    </svg>
  )
}
