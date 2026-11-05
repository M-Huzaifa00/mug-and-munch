import type { RefObject } from 'react'
import { gsap, MQ, useGSAP } from '@/lib/gsap'
import { EASE } from '@/lib/motion-presets'

/**
 * Magnetic pull toward the cursor. Desktop + fine pointer + motion allowed only.
 * Apply to a WRAPPER element (not the button itself) so it doesn't fight CSS hover transforms.
 */
export function useMagnetic(ref: RefObject<HTMLElement | null>, strength = 0.35) {
  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      const mm = gsap.matchMedia()
      mm.add(`${MQ.motionOk} and ${MQ.finePointer}`, () => {
        const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: EASE.out })
        const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: EASE.out })

        const onMove = (e: PointerEvent) => {
          const r = el.getBoundingClientRect()
          xTo((e.clientX - (r.left + r.width / 2)) * strength)
          yTo((e.clientY - (r.top + r.height / 2)) * strength)
        }
        const onLeave = () => {
          gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: EASE.elastic })
        }

        el.addEventListener('pointermove', onMove)
        el.addEventListener('pointerleave', onLeave)
        return () => {
          el.removeEventListener('pointermove', onMove)
          el.removeEventListener('pointerleave', onLeave)
        }
      })
    },
    { scope: ref },
  )
}
