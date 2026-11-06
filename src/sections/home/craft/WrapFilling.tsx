import { useRef, type ReactNode } from 'react'
import { gsap, MQ, useGSAP } from '@/lib/gsap'
import { EASE, TOYS } from '@/lib/motion-presets'

/** Landing spots on the open tortilla, kept near the middle: [x, y, rotation]. */
const SLOTS: [number, number, number][] = [
  [200, 156, 0], [160, 150, -8], [240, 150, 6], [182, 176, 4], [222, 174, -6], [140, 170, 8], [262, 168, -10], [200, 136, 10],
]

const chunks = (cls: string, rx = 5) => (
  <g className={cls}>
    <rect x="-32" y="-11" width="19" height="15" rx={rx} />
    <rect x="-8" y="-6" width="19" height="15" rx={rx} />
    <rect x="15" y="-12" width="19" height="15" rx={rx} />
  </g>
)
const squiggle = (cls: string) => (
  <>
    <path d="M-34 0c8-10 14 10 22 0s14 10 22 0 14 10 22 0" fill="none" strokeWidth="11" />
    <path d="M-34 0c8-10 14 10 22 0s14 10 22 0 14 10 22 0" fill="none" className={cls} strokeWidth="5" />
  </>
)
const rings = (cls: string) => (
  <g fill="none" className={cls} strokeWidth="6">
    <ellipse cx="-14" cy="0" rx="16" ry="7" />
    <ellipse cx="16" cy="2" rx="16" ry="7" />
  </g>
)
const shreds = (cls: string) => (
  <g className={cls} strokeWidth="2.5">
    {[-24, -10, 4, 18].map((x, i) => (
      <rect key={x} x={x} y={-8 + (i % 2) * 6} width="14" height="5" rx="2.5" transform={`rotate(${(i - 1.5) * 18} ${x + 7} 0)`} />
    ))}
  </g>
)

const SHAPES: Record<string, ReactNode> = {
  tikka: chunks('fill-caramel'),
  malai: chunks('fill-oat'),
  crispy: chunks('fill-cheese', 8),
  seekh: (
    <g className="fill-espresso">
      <rect x="-34" y="-8" width="32" height="12" rx="6" />
      <rect x="2" y="-4" width="32" height="12" rx="6" />
    </g>
  ),
  paneer: chunks('fill-bubblegum', 2),
  cheddar: shreds('fill-cheese'),
  mozzarella: shreds('fill-oat'),
  lettuce: <path d="M-36 2c6-9 12 4 18-2s12 6 18 0 12 6 18 0 12 4 16 2c2 8-4 12-10 12h-50c-8 0-12-6-10-12z" className="fill-pickle" />,
  onion: rings('stroke-bubblegum'),
  pickled: rings('stroke-chili'),
  tomato: (
    <g className="fill-chili">
      <circle cx="-14" cy="0" r="11" />
      <circle cx="14" cy="2" r="11" />
    </g>
  ),
  cucumber: (
    <g>
      {[-14, 14].map((x) => (
        <g key={x}>
          <circle cx={x} cy="0" r="11" className="fill-pickle" />
          <circle cx={x} cy="0" r="6" className="fill-oat" strokeWidth="2" />
        </g>
      ))}
    </g>
  ),
  jalapeno: (
    <g className="fill-pickle">
      {[-16, 14].map((x) => (
        <g key={x}>
          <ellipse cx={x} cy="0" rx="13" ry="9" />
          <ellipse cx={x} cy="0" rx="5" ry="3.5" className="fill-oat" strokeWidth="2" />
        </g>
      ))}
    </g>
  ),
  garlic: squiggle('stroke-oat'),
  mint: squiggle('stroke-pickle'),
  chipotle: squiggle('stroke-chili'),
  imli: squiggle('stroke-caramel'),
  house: squiggle('stroke-bubblegum'),
}

interface WrapFillingProps {
  kind: string
  slot: number
  /** Tap the filling on the board to remove it (mouse/touch convenience; tiles are the accessible path). */
  onRemove?: () => void
}

/** One filling dropped onto the tortilla (drop + squash on mount; motion allowed only). */
export function WrapFilling({ kind, slot, onRemove }: WrapFillingProps) {
  const ref = useRef<SVGGElement>(null)
  const [x, y, r] = SLOTS[slot % SLOTS.length] ?? [200, 160, 0]

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MQ.motionOk, () => {
        gsap
          .timeline()
          .from(ref.current, { y: -180, opacity: 0, duration: TOYS.drop, ease: 'power2.in' })
          .to(ref.current, { scaleY: 0.65, scaleX: 1.15, transformOrigin: '50% 100%', duration: TOYS.squash })
          .to(ref.current, { scaleY: 1, scaleX: 1, duration: TOYS.settle, ease: EASE.elastic })
      })
    },
    { scope: ref },
  )

  return (
    <g transform={`translate(${x} ${y}) rotate(${r})`} onClick={onRemove} className={onRemove ? 'cursor-pointer' : undefined}>
      <g ref={ref}>{SHAPES[kind] ?? chunks('fill-caramel')}</g>
    </g>
  )
}
