import type { Ref } from 'react'
import type { Category, MenuItem } from '@/data/menu'
import { BRAND_INK, brandSrc } from '@/lib/brand'

const FILL: Record<Category, string> = {
  coffee: 'fill-caramel',
  matcha: 'fill-pickle',
  drinks: 'fill-bubblegum',
  burger: 'fill-chili',
  steak: 'fill-cheese',
  wrap: 'fill-pickle',
}
const R = 100

const point = (deg: number, r = R) => {
  const rad = ((deg - 90) * Math.PI) / 180
  return [Math.cos(rad) * r, Math.sin(rad) * r] as const
}

interface RouletteWheelProps {
  items: MenuItem[]
  /** The rotating group (GSAP / Draggable target). */
  wheelRef: Ref<SVGGElement>
}

/** Segments clockwise from the top (segment i spans i·seg → (i+1)·seg). Pointer is fixed at the top. */
export function RouletteWheel({ items, wheelRef }: RouletteWheelProps) {
  const seg = 360 / items.length

  return (
    <svg viewBox="-118 -128 236 246" className="h-full w-full overflow-visible" style={{ color: BRAND_INK }} aria-hidden="true">
      <circle r={R + 10} className="fill-espresso" stroke="currentColor" strokeWidth="5" />
      <g ref={wheelRef}>
        {items.map((item, i) => {
          const [x0, y0] = point(i * seg)
          const [x1, y1] = point((i + 1) * seg)
          const mid = i * seg + seg / 2
          const [ex, ey] = point(mid, 66)
          return (
            <g key={item.id}>
              <path
                d={`M0 0L${x0} ${y0}A${R} ${R} 0 0 1 ${x1} ${y1}Z`}
                className={`${FILL[item.category]} ${i % 2 ? 'opacity-85' : ''}`}
                stroke="currentColor"
                strokeWidth="3"
                strokeLinejoin="round"
              />
              <text x={ex} y={ey} fontSize="24" textAnchor="middle" dominantBaseline="central" transform={`rotate(${mid} ${ex} ${ey})`}>
                {item.emoji}
              </text>
            </g>
          )
        })}
        {items.map((item, i) => {
          const [px, py] = point(i * seg, R + 4)
          return <circle key={`peg-${item.id}`} cx={px} cy={py} r="3.5" className="fill-cheese" />
        })}
      </g>
      <circle r="30" className="fill-oat" stroke="currentColor" strokeWidth="4" />
      <image href={brandSrc('icon', 128)} x="-21" y="-26" width="42" height="52" />
      <path d="M-14 -126h28l-14 26z" className="fill-chili" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
    </svg>
  )
}
