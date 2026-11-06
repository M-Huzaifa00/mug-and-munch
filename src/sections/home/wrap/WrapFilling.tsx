import { useRef, type ReactNode } from 'react'
import type { WrapFillingId } from '@/data/toys'
import { gsap, MQ, useGSAP } from '@/lib/gsap'
import { EASE, TOYS } from '@/lib/motion-presets'

/** Landing spots on the flat tortilla: [x, y, rotation]. */
const SLOTS: [number, number, number][] = [
  [150, 150, -8], [208, 142, 6], [262, 152, -4], [132, 174, 4], [190, 178, -6], [246, 176, 8], [296, 166, -10], [172, 158, 10], [230, 160, -6],
]

const chunks = (cls: string, rx = 5) => (
  <g className={cls}>
    <rect x="-32" y="-11" width="19" height="15" rx={rx} />
    <rect x="-8" y="-6" width="19" height="15" rx={rx} />
    <rect x="15" y="-12" width="19" height="15" rx={rx} />
  </g>
)

const SHAPES: Record<WrapFillingId, ReactNode> = {
  tikka: (
    <>
      {chunks('fill-caramel')}
      <path d="M-28-6l8 6M-3-1l8 6M20-7l8 6" strokeWidth="2.5" />
    </>
  ),
  malai: (
    <>
      {chunks('fill-oat')}
      <g className="fill-caramel" stroke="none"><circle cx="-23" cy="-4" r="2" /><circle cx="2" cy="1" r="2" /><circle cx="25" cy="-5" r="2" /></g>
    </>
  ),
  paneer: chunks('fill-cheese', 2),
  fries: (
    <g className="fill-cheese">
      {[-26, -12, 2, 16].map((x, i) => (
        <rect key={x} x={x} y="-14" width="9" height="30" rx="2" transform={`rotate(${(i - 1.5) * 14} ${x + 4} 0)`} />
      ))}
    </g>
  ),
  lettuce: <path d="M-36 2c6-9 12 4 18-2s12 6 18 0 12 6 18 0 12 4 16 2c2 8-4 12-10 12h-50c-8 0-12-6-10-12z" className="fill-pickle" />,
  onion: (
    <g fill="none" className="stroke-bubblegum" strokeWidth="6">
      <ellipse cx="-14" cy="0" rx="16" ry="7" />
      <ellipse cx="16" cy="2" rx="16" ry="7" />
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
  garlic: (
    <>
      <path d="M-34 0c8-10 14 10 22 0s14 10 22 0 14 10 22 0" fill="none" strokeWidth="11" />
      <path d="M-34 0c8-10 14 10 22 0s14 10 22 0 14 10 22 0" fill="none" className="stroke-oat" strokeWidth="5" />
    </>
  ),
  chutney: (
    <>
      <path d="M-34 4c8-10 14 10 22 0s14 10 22 0 14 10 22 0" fill="none" strokeWidth="11" />
      <path d="M-34 4c8-10 14 10 22 0s14 10 22 0 14 10 22 0" fill="none" className="stroke-pickle" strokeWidth="5" />
    </>
  ),
}

/** One filling dropped onto the tortilla at its slot (drop + squash on mount; motion allowed only). */
export function WrapFilling({ kind, slot }: { kind: WrapFillingId; slot: number }) {
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
    <g transform={`translate(${x} ${y}) rotate(${r})`}>
      <g ref={ref}>{SHAPES[kind]}</g>
    </g>
  )
}
