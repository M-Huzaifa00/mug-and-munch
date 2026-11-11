import { useRef } from 'react'
import { gsap, MQ, ScrollTrigger, useGSAP } from '@/lib/gsap'
import { cn } from '@/lib/utils'

/**
 * Giant drifting background type (decorative): two identical halves slide left forever (xPercent 0 → -50),
 * only while on screen. Put it inside a `relative overflow-hidden` section; colour via `className`
 * (e.g. `text-espresso/10`). Reduced motion: static.
 */
export function DriftType({ text, className, position = 'top-1/2 -translate-y-1/2', duration = 40 }: { text: string; className?: string; position?: string; duration?: number }) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MQ.motionOk, () => {
        const drift = gsap.to('[data-drift]', { xPercent: -50, duration, ease: 'none', repeat: -1 })
        ScrollTrigger.create({ trigger: ref.current, start: 'top bottom', end: 'bottom top', onToggle: (self) => (self.isActive ? drift.play() : drift.pause()) })
      })
    },
    { scope: ref, dependencies: [duration] },
  )

  return (
    <div ref={ref} aria-hidden="true" className={cn('pointer-events-none absolute inset-x-0 overflow-hidden select-none', position)}>
      <div data-drift className={cn('flex w-max font-display leading-none font-extrabold whitespace-nowrap', className)}>
        <span>{text}</span>
        <span>{text}</span>
      </div>
    </div>
  )
}
