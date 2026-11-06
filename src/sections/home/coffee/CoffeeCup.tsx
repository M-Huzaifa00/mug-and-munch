import { useId, useRef } from 'react'
import { BRAND_INK } from '@/lib/brand'
import { gsap, MQ, useGSAP } from '@/lib/gsap'
import { EASE, TOYS } from '@/lib/motion-presets'
import { useReducedMotion } from '@/hooks/useReducedMotion'

export type CupSize = 's' | 'm' | 'l'
export type CupMilk = 'regular' | 'oat' | 'almond'

/** Liquid top (viewBox y) per size: cup rim is at 70, bottom at 300. */
const LEVEL: Record<CupSize, number> = { s: 200, m: 152, l: 106 }
/** Milk tints, mixed from tokens only. */
const MILK_FILL: Record<CupMilk, string> = {
  regular: 'var(--color-caramel)',
  oat: 'color-mix(in oklab, var(--color-caramel) 62%, var(--color-oat))',
  almond: 'color-mix(in oklab, var(--color-caramel) 58%, var(--color-cheese))',
}
const MILKS = Object.keys(MILK_FILL) as CupMilk[]
const CUP = 'M52 70h156l-18 214c-1 10-8 16-18 16H88c-10 0-17-6-18-16z'
/** Wide liquid body with a wavy top edge (top at y=0); rolled sideways for the wave motion. */
const LIQUID = `M0 0${Array.from({ length: 8 }, (_, i) => `q32.5 ${i % 2 ? 9 : -9} 65 0`).join('')}V260H0z`

interface CoffeeCupProps {
  size: CupSize
  milk: CupMilk
  iced: boolean
}

/** Animated latte: liquid pours to the size level, milk shifts the colour, steam (hot) or ice + straw (iced). */
export function CoffeeCup({ size, milk, iced }: CoffeeCupProps) {
  const ref = useRef<SVGSVGElement>(null)
  const first = useRef(true)
  const prevIced = useRef(false)
  const reduced = useReducedMotion()
  const clipId = `mm-cup-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`

  // Ambient loops (motion only): rolling wave + steam wisps.
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MQ.motionOk, () => {
        gsap.to('[data-wave]', { x: -260, duration: 3, ease: 'none', repeat: -1 })
        gsap.to('[data-steam] path', { y: -12, opacity: 0.2, duration: 1.4, ease: 'sine.inOut', yoyo: true, repeat: -1, stagger: 0.3 })
      })
    },
    { scope: ref },
  )

  // React to choices.
  useGSAP(
    () => {
      const d = first.current || reduced ? 0 : 1
      first.current = false
      gsap.to('[data-liquid]', { y: LEVEL[size], duration: TOYS.pour * d, ease: EASE.bouncy })
      gsap.to('[data-milk]', { opacity: (i: number) => (MILKS[i] === milk ? 1 : 0), duration: 0.6 * d })
      gsap.to('[data-steam]', { autoAlpha: iced ? 0 : 1, duration: 0.4 * d })
      gsap.to('[data-straw]', { autoAlpha: iced ? 1 : 0, y: iced ? 0 : -40, duration: 0.5 * d, ease: EASE.out })
      const justIced = iced && !prevIced.current
      prevIced.current = iced
      // Cubes float half-submerged at the liquid surface.
      const iceY = (i: number) => LEVEL[size] - 18 + (i % 2) * 8
      if (iced && justIced && d) {
        gsap.fromTo('[data-ice]', { y: -200, autoAlpha: 1 }, { y: iceY, duration: TOYS.iceDrop, ease: 'bounce.out', stagger: 0.12 })
        gsap.set('[data-splash]', { y: LEVEL[size] })
        gsap.fromTo(
          '[data-splash] circle',
          { x: 0, y: 0, scale: 1, autoAlpha: 1 },
          { x: (i: number) => (i - 2.5) * 22, y: () => -40 - Math.random() * 40, scale: 0.3, autoAlpha: 0, duration: 0.6, ease: 'power2.out', delay: TOYS.iceDrop * 0.7 },
        )
      } else if (iced) {
        gsap.to('[data-ice]', { y: iceY, autoAlpha: 1, duration: TOYS.pour * d, ease: EASE.bouncy })
      } else {
        gsap.to('[data-ice]', { autoAlpha: 0, y: -60, duration: 0.3 * d })
      }
    },
    { scope: ref, dependencies: [size, milk, iced, reduced] },
  )

  return (
    <svg ref={ref} viewBox="0 0 260 330" className="h-full w-auto overflow-visible" style={{ color: BRAND_INK }} aria-hidden="true">
      <defs>
        <clipPath id={clipId}>
          <path d={CUP} />
        </clipPath>
      </defs>
      <g data-steam fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round">
        <path d="M104 52c-10-10 6-16-2-30" />
        <path d="M130 50c-10-12 8-18-1-36" />
        <path d="M156 52c-10-10 6-16-2-30" />
      </g>
      <path d={CUP} className="fill-oat" />
      <g clipPath={`url(#${clipId})`}>
        <g data-liquid transform={`translate(0 ${LEVEL[size]})`}>
          <g data-wave>
            {MILKS.map((m) => (
              <path key={m} data-milk d={LIQUID} style={{ fill: MILK_FILL[m], opacity: m === milk ? 1 : 0 }} />
            ))}
          </g>
        </g>
      </g>
      {/* Ice lives outside the clip so it's visible while falling in from above the rim. */}
      {[86, 128, 168].map((x) => (
        <rect key={x} data-ice x={x} y={0} width="30" height="30" rx="7" className="fill-oat/80" stroke="currentColor" strokeWidth="4" style={{ visibility: 'hidden' }} />
      ))}
      <path data-straw d="M170 30l-22 170" className="stroke-pickle" strokeWidth="14" strokeLinecap="round" style={{ visibility: 'hidden' }} />
      <path d={CUP} fill="none" stroke="currentColor" strokeWidth="6" strokeLinejoin="round" />
      <path d="M206 112c40-4 42 70 2 74" fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
      <g data-splash className="fill-caramel">
        {Array.from({ length: 6 }, (_, i) => (
          <circle key={i} cx="130" cy="0" r="5" style={{ visibility: 'hidden' }} />
        ))}
      </g>
    </svg>
  )
}
