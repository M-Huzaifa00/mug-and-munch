import { useRef } from 'react'
import { STORY_PANELS } from '@/data/story'
import { gsap, MQ, useGSAP } from '@/lib/gsap'
import { EASE } from '@/lib/motion-presets'
import { cn } from '@/lib/utils'
import { ProductImage } from '@/components/ui/ProductImage'
import { Sticker } from '@/components/ui/Sticker'

/** Coffee / burgers / wraps panels: clip-path image reveal + doodle sticker on scroll. Reduced motion: static. */
export function StoryPanels() {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MQ.motionOk, () => {
        gsap.utils.toArray<HTMLElement>('[data-panel]').forEach((panel, i) => {
          const tl = gsap.timeline({ scrollTrigger: { trigger: panel, start: 'top 70%', once: true } })
          tl.fromTo(panel.querySelector('[data-reveal]'), { clipPath: i % 2 ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0%)', duration: 0.9, ease: EASE.out })
            .from(panel.querySelectorAll('[data-copy] > *'), { y: 24, opacity: 0, duration: 0.5, stagger: 0.08, ease: EASE.out }, 0.15)
            .from(panel.querySelector('[data-doodle]'), { scale: 0, rotate: -20, duration: 0.5, ease: EASE.bouncy }, 0.6)
        })
      })
    },
    { scope: root },
  )

  return (
    <div ref={root}>
      {STORY_PANELS.map((p, i) => (
        <section key={p.id} data-panel aria-labelledby={`story-${p.id}`} className={cn('grain relative overflow-hidden px-4 py-16 sm:px-6 md:py-24', p.bg)}>
          <div className={cn('mx-auto grid max-w-6xl items-center gap-8 md:grid-cols-2 md:gap-14', i % 2 && 'md:[&>*:first-child]:order-2')}>
            <div className="relative">
              <div data-reveal className="aspect-[4/3] overflow-hidden rounded-blob border-[2.5px] border-espresso shadow-hard">
                <ProductImage name={p.title} emoji={p.emoji} image={p.image} category={p.id} showName={false} />
              </div>
              <Sticker kind={p.sticker} className="-top-5 -right-3" tilt={i % 2 ? -10 : 10} />
              <p data-doodle className="absolute -bottom-5 left-4 -rotate-3 rounded-full border-2 border-espresso bg-oat px-3 py-1 font-hand text-xl text-espresso">
                {p.doodle}
              </p>
            </div>
            <div data-copy>
              <h2 id={`story-${p.id}`} className="text-display font-extrabold text-espresso">
                {p.title}
              </h2>
              <p className="mt-4 max-w-md text-lg font-medium text-espresso">{p.body}</p>
            </div>
          </div>
        </section>
      ))}
    </div>
  )
}
