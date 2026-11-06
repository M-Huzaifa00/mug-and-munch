import { useRef } from 'react'
import { gsap, MQ, useGSAP } from '@/lib/gsap'

/** Tiny bouncing coffee bean + "scroll" in Caveat. */
export function ScrollHint() {
  const ref = useRef<HTMLDivElement>(null)
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MQ.motionOk, () => {
        gsap.to('[data-bean]', { y: 10, rotate: 20, duration: 0.7, ease: 'sine.inOut', yoyo: true, repeat: -1 })
      })
    },
    { scope: ref },
  )

  return (
    <div ref={ref} className="pointer-events-none absolute bottom-5 left-1/2 hidden -translate-x-1/2 flex-col items-center md:flex" aria-hidden="true">
      <svg data-bean viewBox="0 0 24 32" className="h-8 w-6">
        <ellipse cx="12" cy="16" rx="9" ry="13" className="fill-caramel stroke-espresso" strokeWidth="2.5" />
        <path d="M12 4c-5 6 5 18 0 24" className="fill-none stroke-espresso" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
      <span className="font-hand text-xl text-ink">scroll</span>
    </div>
  )
}
