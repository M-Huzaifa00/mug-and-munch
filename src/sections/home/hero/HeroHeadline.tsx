import { useRef } from 'react'
import { gsap, MQ, SplitText, useGSAP } from '@/lib/gsap'
import { DUR, EASE, STAGGER } from '@/lib/motion-presets'
import { cn } from '@/lib/utils'

const WORDS = [
  { text: 'SIP.', ink: 'stroke-caramel', className: 'text-espresso' },
  { text: 'BITE.', ink: 'stroke-chili', className: 'text-chili' },
  { text: 'REPEAT.', ink: 'stroke-pickle', className: 'text-espresso' },
]

/**
 * "SIP. BITE. REPEAT." Chars pop in with an elastic stagger once `play` is true,
 * then each word's hand-drawn underline draws in (DrawSVG). Reduced motion: static, underlines drawn.
 */
export function HeroHeadline({ play }: { play: boolean }) {
  const ref = useRef<HTMLHeadingElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      const mm = gsap.matchMedia()
      mm.add(MQ.motionOk, () => {
        const split = SplitText.create(el.querySelectorAll('[data-word]'), { type: 'chars' })
        const lines = el.querySelectorAll('[data-underline]')
        gsap.set(split.chars, { yPercent: 115, rotate: 12, opacity: 0 })
        gsap.set(lines, { drawSVG: '0%' })
        if (play) {
          gsap
            .timeline({ delay: 0.05 })
            .to(split.chars, { yPercent: 0, rotate: 0, opacity: 1, duration: DUR.hero, ease: EASE.elastic, stagger: STAGGER.chars })
            .to(lines, { drawSVG: '100%', duration: DUR.base, ease: EASE.out, stagger: 0.15 }, '-=0.9')
        }
        return () => split.revert()
      })
    },
    { scope: ref, dependencies: [play], revertOnUpdate: true },
  )

  return (
    <h1 ref={ref} className="text-mega font-extrabold md:text-[clamp(4.5rem,8.6vw,9.5rem)]">
      {WORDS.map((w) => (
        <span key={w.text} className="relative mr-[0.18em] inline-block last:mr-0">
          <span data-word className={cn('inline-block overflow-hidden pb-[0.06em] align-bottom', w.className)}>
            {w.text}
          </span>
          <svg
            aria-hidden="true"
            viewBox="0 0 200 20"
            preserveAspectRatio="none"
            className={cn('absolute -bottom-[0.04em] left-0 h-[0.16em] w-full fill-none', w.ink)}
          >
            {/* espresso outline under the colour stroke so light tokens (pickle) still read on oat */}
            <path data-underline d="M4 13c38-8 78-9 118-5s54 5 74-2" strokeWidth="11" strokeLinecap="round" className="stroke-espresso" />
            <path data-underline d="M4 13c38-8 78-9 118-5s54 5 74-2" strokeWidth="6" strokeLinecap="round" />
          </svg>
        </span>
      ))}
    </h1>
  )
}
