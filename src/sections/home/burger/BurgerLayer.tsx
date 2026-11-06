import { useRef, type ReactNode } from 'react'
import type { BurgerLayerId } from '@/data/toys'
import { BRAND_INK } from '@/lib/brand'
import { gsap, MQ, useGSAP } from '@/lib/gsap'
import { EASE, TOYS } from '@/lib/motion-presets'

export type LayerKind = BurgerLayerId | 'bottom'

/** viewBox height per layer (width is always 240). */
const H: Record<LayerKind, number> = { bottom: 50, patty: 40, cheese: 32, jalapeno: 26, sauce: 22, lettuce: 30, onion: 24, bun: 88 }

const SHAPES: Record<LayerKind, ReactNode> = {
  bottom: <path d="M20 6h200c4 0 6 4 5 8-4 20-22 32-50 32H65C37 46 19 34 15 14c-1-4 1-8 5-8z" className="fill-cheese" />,
  patty: (
    <>
      <path d="M12 9c0-4 4-7 8-7h200c4 0 8 3 8 7v17c0 7-5 12-12 12H24c-7 0-12-5-12-12z" className="fill-espresso" />
      <g className="fill-caramel" stroke="none">
        <circle cx="50" cy="16" r="3" /><circle cx="96" cy="24" r="2.5" /><circle cx="140" cy="14" r="3" /><circle cx="186" cy="24" r="2.5" />
      </g>
    </>
  ),
  cheese: <path d="M8 4h224l-8 10c-4 6-10 6-12 0l-4-6-12 18c-3 5-9 5-11 0l-6-12H72l-9 15c-3 5-9 5-11 0l-6-13H20z" className="fill-cheese" />,
  jalapeno: (
    <g className="fill-pickle">
      {[40, 90, 140, 190].map((x) => (
        <g key={x}>
          <ellipse cx={x} cy="13" rx="22" ry="10" />
          <ellipse cx={x} cy="13" rx="9" ry="4" className="fill-oat" strokeWidth="2.5" />
        </g>
      ))}
    </g>
  ),
  sauce: <path d="M10 6h220c2 8-10 10-16 8s-12 10-20 6-14 4-22 0-12 8-20 4-16 2-22-2-14 8-22 2-16 4-24 0-14 6-22 2-20 2-26-4z" className="fill-chili" />,
  lettuce: <path d="M6 12c10-10 20 6 30-2s18 8 28 0 20 8 30 0 18 8 28 0 20 8 30 0 18 8 28 0 20 6 30 2c4 6-2 14-10 14H16C8 26 2 18 6 12z" className="fill-pickle" />,
  onion: (
    <g fill="none">
      {[56, 120, 184].map((x) => (
        <ellipse key={x} cx={x} cy="12" rx="34" ry="8" className="stroke-bubblegum" strokeWidth="7" />
      ))}
    </g>
  ),
  bun: (
    <>
      <path d="M14 82c0-42 48-78 106-78s106 36 106 78c0 3-3 5-6 5H20c-3 0-6-2-6-5z" className="fill-cheese" />
      <g className="fill-oat" strokeWidth="2">
        <ellipse cx="80" cy="34" rx="5" ry="3" transform="rotate(-20 80 34)" />
        <ellipse cx="120" cy="24" rx="5" ry="3" />
        <ellipse cx="158" cy="36" rx="5" ry="3" transform="rotate(20 158 36)" />
        <ellipse cx="100" cy="52" rx="5" ry="3" />
        <ellipse cx="142" cy="56" rx="5" ry="3" />
      </g>
    </>
  ),
}

/** One burger layer. `drop` = fall in from above with squash & stretch on mount (motion allowed only). */
export function BurgerLayer({ kind, drop = true }: { kind: LayerKind; drop?: boolean }) {
  const ref = useRef<SVGSVGElement>(null)

  useGSAP(
    () => {
      if (!drop) return
      const mm = gsap.matchMedia()
      mm.add(MQ.motionOk, () => {
        gsap
          .timeline()
          .from(ref.current, { y: -340, opacity: 0, duration: TOYS.drop, ease: 'power2.in' })
          .to(ref.current, { scaleY: 0.7, scaleX: 1.12, transformOrigin: '50% 100%', duration: TOYS.squash, ease: 'power1.out' })
          .to(ref.current, { scaleY: 1.1, scaleX: 0.94, duration: TOYS.squash * 1.4, ease: 'power1.out' })
          .to(ref.current, { scaleY: 1, scaleX: 1, duration: TOYS.settle, ease: EASE.elastic })
      })
    },
    { scope: ref },
  )

  return (
    <svg
      ref={ref}
      data-layer
      viewBox={`0 0 240 ${H[kind]}`}
      className="-mb-[3%] block w-full first:mb-0"
      style={{ color: BRAND_INK }}
      aria-hidden="true"
    >
      <g stroke="currentColor" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round">
        {SHAPES[kind]}
      </g>
    </svg>
  )
}
