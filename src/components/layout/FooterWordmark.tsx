import { useRef } from 'react'
import { site } from '@/config/site'
import { gsap, MQ, SplitText, useGSAP } from '@/lib/gsap'

/**
 * Giant brand wordmark ("MUG n MUNCH", script "n" like the logo) revealed letter by letter,
 * scrubbed to scroll. Reduced motion: static.
 */
export function FooterWordmark() {
  const ref = useRef<HTMLParagraphElement>(null)
  const words = site.brandName.split(' ')
  const middle = words.length === 3 ? words[1] : null

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      const mm = gsap.matchMedia()
      mm.add(MQ.motionOk, () => {
        const split = SplitText.create(el.querySelectorAll('[data-letters]'), { type: 'chars', mask: 'chars' })
        const st = { trigger: el, start: 'top bottom', end: 'bottom bottom-=40', scrub: 1 }
        gsap.from(split.chars, { yPercent: 110, rotate: 8, ease: 'none', stagger: 0.08, scrollTrigger: st })
        // The script "n" has NO clip mask (its slanted glyph overhangs its box and got cut): it fades + rises in.
        gsap.from(el.querySelectorAll('[data-script]'), { yPercent: 40, rotate: -12, opacity: 0, ease: 'none', scrollTrigger: st })
        return () => split.revert()
      })
    },
    { scope: ref },
  )

  return (
    <p
      ref={ref}
      aria-hidden="true"
      className="text-mega pointer-events-none flex items-baseline justify-center gap-[0.12em] px-2 pb-2 text-center font-display font-extrabold whitespace-nowrap text-oat select-none"
    >
      {middle ? (
        <>
          <span data-letters aria-hidden="true">{words[0]?.toUpperCase()}</span>
          {/* no overflow mask here: the slanted script glyph overhangs its box (a mask clipped its right edge) */}
          <span data-script aria-hidden="true" className="inline-block px-[0.06em] font-hand text-[1.15em] leading-none font-bold text-chili">
            {middle}
          </span>
          <span data-letters aria-hidden="true">{words[2]?.toUpperCase()}</span>
        </>
      ) : (
        <span data-letters aria-hidden="true">{site.brandName.toUpperCase()}</span>
      )}
    </p>
  )
}
