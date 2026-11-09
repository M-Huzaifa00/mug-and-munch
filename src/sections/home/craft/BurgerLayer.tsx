import { useId, useRef } from 'react'
import { gsap, MQ, useGSAP } from '@/lib/gsap'
import { EASE, TOYS } from '@/lib/motion-presets'
import { BURGER_ART } from './burgerArt'
import { LAYER_HEIGHT, type LayerKind } from './burgerLayerKind'

export type { LayerKind } from './burgerLayerKind'

/** One realistic burger layer. `drop` = fall in from above with squash & stretch on mount (motion allowed only). */
export function BurgerLayer({ kind, drop = true }: { kind: LayerKind; drop?: boolean }) {
  const ref = useRef<SVGSVGElement>(null)
  // Gradient ids must be unique per layer (the same ingredient can appear several times).
  const id = `bl-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`

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
    <svg ref={ref} data-layer viewBox={`0 0 240 ${LAYER_HEIGHT[kind]}`} className="-mb-[3%] block w-full overflow-visible first:mb-0" aria-hidden="true">
      {BURGER_ART[kind](id)}
    </svg>
  )
}
