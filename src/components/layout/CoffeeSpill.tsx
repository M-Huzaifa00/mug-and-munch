import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { SPILL_EVENT } from '@/lib/easterEgg'
import { gsap, useGSAP } from '@/lib/gsap'
import { EASE } from '@/lib/motion-presets'
import { notify } from '@/lib/notify'
import { useReducedMotion } from '@/hooks/useReducedMotion'

/** Coffee with drips hanging from the top edge (viewBox 100×100, stretched full screen). */
const COFFEE = 'M0 0H100V58Q96 70 93 58Q90 84 86 60Q82 66 78 58Q74 92 70 60Q65 70 60 57Q56 78 52 60Q47 66 42 58Q38 88 34 60Q30 70 25 58Q21 74 17 59Q12 66 8 58Q4 80 0 60Z'

/**
 * Easter egg: 5 quick clicks on the navbar logo → coffee spills down the screen,
 * then a cheese "mop" sweeps up and cleans it. Reduced motion: just a toast.
 */
export function CoffeeSpill() {
  const [active, setActive] = useState(false)
  const reduced = useReducedMotion()
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onSpill = () => {
      if (reduced) notify('☕ Oops, Munchy spilled the coffee… already mopped!')
      else setActive(true)
    }
    window.addEventListener(SPILL_EVENT, onSpill)
    return () => window.removeEventListener(SPILL_EVENT, onSpill)
  }, [reduced])

  useGSAP(
    () => {
      if (!active || !root.current) return
      const q = gsap.utils.selector(root)
      gsap
        .timeline({
          onComplete: () => {
            setActive(false)
            notify('Spill? What spill? All mopped up 🧽')
          },
        })
        .fromTo(q('[data-coffee]'), { scaleY: 0 }, { scaleY: 1.25, transformOrigin: '50% 0%', duration: 1.1, ease: 'power2.in' })
        .fromTo(q('[data-oops]'), { scale: 0, rotate: -15 }, { scale: 1, rotate: -6, duration: 0.4, ease: EASE.bouncy }, 0.5)
        .to({}, { duration: 0.5 })
        .fromTo(q('[data-mop]'), { yPercent: 120 }, { yPercent: -130, duration: 1.1, ease: 'power2.inOut' })
        .to(root.current, { clipPath: 'inset(0% 0% 100% 0%)', duration: 1.1, ease: 'power2.inOut' }, '<0.08')
    },
    { dependencies: [active], scope: root },
  )

  if (!active) return null
  return createPortal(
    <div ref={root} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[97]" style={{ clipPath: 'inset(0% 0% 0% 0%)' }}>
      <svg data-coffee viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full">
        <path d={COFFEE} className="fill-caramel" />
        <path d={COFFEE} className="fill-espresso" opacity={0.55} transform="translate(0 -6)" />
      </svg>
      <p data-oops className="absolute top-1/3 left-1/2 -translate-x-1/2 font-hand text-6xl whitespace-nowrap text-oat drop-shadow-[3px_3px_0_var(--color-espresso)]">
        oops! ☕
      </p>
      <div data-mop className="absolute inset-x-0 bottom-0 flex h-24 items-center justify-center border-y-[3px] border-espresso bg-cheese font-display text-3xl font-extrabold text-espresso">
        🧽 mopping…
      </div>
    </div>,
    document.body,
  )
}
