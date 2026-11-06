import { useRef } from 'react'
import { getBestsellers, getItemBySlug, type MenuItem } from '@/data/menu'
import { gsap, MQ, useGSAP } from '@/lib/gsap'
import { cn } from '@/lib/utils'
import { HandArrow } from '@/components/ui/HandArrow'
import { ProductCard } from '@/components/ui/ProductCard'
import { RevealHeading } from '@/components/ui/RevealHeading'
import { LogoStamp } from '@/components/brand/LogoStamp'

const EXTRA_NOTES = ['the one everyone orders 👀', 'midnight fav 🌙', 'double trouble 🔥', 'garma garam 🔥', 'cheesy chaos 🧀', 'new obsession 💚']
const ITEMS: MenuItem[] = [...getBestsellers(), getItemBySlug('pistachio-latte'), getItemBySlug('tikka-smash')].filter(
  (i): i is MenuItem => Boolean(i),
)
const PIN_QUERY = `(min-width: 1024px) and ${MQ.motionOk}`

/**
 * Desktop: pinned horizontal scroll (pin + scrub) with a progress bar.
 * Mobile / reduced motion: native swipe carousel with scroll-snap (no pinning).
 */
export function Bestsellers() {
  const section = useRef<HTMLElement>(null)
  const scroller = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLUListElement>(null)
  const bar = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(PIN_QUERY, () => {
        const distance = () => Math.max(0, (track.current?.scrollWidth ?? 0) - window.innerWidth)
        gsap.set(scroller.current, { overflow: 'visible' })
        gsap
          .timeline({
            scrollTrigger: {
              trigger: section.current,
              start: 'top top',
              end: () => `+=${distance()}`,
              pin: true,
              scrub: 1,
              invalidateOnRefresh: true,
            },
          })
          .to(track.current, { x: () => -distance(), ease: 'none' }, 0)
          .fromTo(bar.current, { scaleX: 0 }, { scaleX: 1, ease: 'none' }, 0)
      })
    },
    { scope: section },
  )

  // Mobile carousel progress (transform only).
  const onScroll = () => {
    const el = scroller.current
    if (!el || !bar.current || window.matchMedia(PIN_QUERY).matches) return
    const max = el.scrollWidth - el.clientWidth
    gsap.set(bar.current, { scaleX: max > 0 ? el.scrollLeft / max : 0 })
  }

  return (
    <section ref={section} aria-labelledby="bestsellers-title" className="grain relative overflow-hidden bg-oat lg:flex lg:h-dvh lg:flex-col lg:justify-center">
      <div className="relative mx-auto w-full max-w-7xl px-4 pt-20 sm:px-6 lg:pt-24">
        <LogoStamp size={96} className="absolute top-10 right-4 rotate-12 sm:right-8" />
        <RevealHeading id="bestsellers-title" className="text-display font-extrabold text-espresso">
          Bestsellers
        </RevealHeading>
        <p className="mt-1 -rotate-1 font-hand text-2xl text-ink sm:text-3xl">the ones Islamabad keeps coming back for</p>
        <div className="mt-6 h-2.5 overflow-hidden rounded-full border-2 border-espresso bg-oat" aria-hidden="true">
          <div ref={bar} className="h-full origin-left scale-x-0 bg-chili" />
        </div>
      </div>

      <div
        ref={scroller}
        onScroll={onScroll}
        data-lenis-prevent-wheel
        className="snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none]"
      >
        <ul ref={track} className="flex w-max gap-5 px-4 pt-14 pb-12 sm:px-6 lg:gap-8 lg:px-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))]">
          {ITEMS.map((item, i) => (
            <li key={item.id} className="relative w-[76vw] shrink-0 snap-center sm:w-[44vw] lg:w-[30vw] xl:w-[25vw]">
              <p
                className={cn(
                  'pointer-events-none absolute -top-11 left-3 z-10 flex items-end gap-1 font-hand text-xl text-ink sm:text-2xl',
                  i % 2 ? 'rotate-2' : '-rotate-3',
                )}
              >
                {item.note ?? EXTRA_NOTES[i % EXTRA_NOTES.length]}
                <HandArrow className="h-9 w-12 rotate-[30deg]" />
              </p>
              <ProductCard item={item} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
