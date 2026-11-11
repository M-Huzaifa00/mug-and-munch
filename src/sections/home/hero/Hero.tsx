import { useRef } from 'react'
import { useLenis } from 'lenis/react'
import { site } from '@/config/site'
import { MUNCH_SIZE_CLASS } from '@/data/munchRun'
import { gsap, MQ, useGSAP } from '@/lib/gsap'
import { DUR, EASE } from '@/lib/motion-presets'
import { cn } from '@/lib/utils'
import { Button, ButtonLink } from '@/components/ui/Button'
import { MagneticButton } from '@/components/ui/MagneticButton'
import { MunchStop } from '@/components/munchRun/MunchStop'
import { HeroMeta } from '../hero/HeroMeta'
import { HeroOrderPeek } from '../hero/HeroOrderPeek'
import { SECTION_IDS } from '../sectionIds'
import { HeroSketch } from './HeroSketch'

const LINES = [
  { text: 'SIP.', className: 'text-espresso' },
  { text: 'BITE.', className: 'text-chili' },
  { text: 'REPEAT.', className: 'text-espresso [text-shadow:0.05em_0.05em_0_var(--color-cheese)]', munch: true },
] as const

/**
 * Home hero "The Sketch" (owner pick, 2026-11-12). Left: the owner's copy, stacked type rising out of
 * masks, Order Now with the Munchy peek. Right: the logo's tray drawn live in the logo's ink line (DrawSVG),
 * flat colours printed in off-register (risograph), hand-written notes pointing at real items + prices.
 * Idle: items bob, steam curls, sparkles twinkle. Scroll: the tray drifts and the items spread a little.
 * Reduced motion: the finished drawing, static.
 */
export function Hero({ play }: { play: boolean }) {
  const ref = useRef<HTMLElement>(null)
  const lenis = useLenis()

  const toMenu = () => {
    const el = document.getElementById(SECTION_IDS.menuPreview)
    if (!el) return
    if (lenis) lenis.scrollTo(el, { offset: -20, duration: 1.4 })
    else el.scrollIntoView({ behavior: 'smooth' })
  }

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MQ.motionOk, () => {
        gsap.set('[data-hn-line]', { yPercent: 110 })
        gsap.set(['[data-sk-line]', '[data-sk-arrow]', '[data-sk-steam] path'], { drawSVG: '0%' })
        gsap.set('[data-sk-fill]', { autoAlpha: 0, x: 10, y: 10 })
        gsap.set(['[data-sk-note]', '[data-sk-spark]'], { autoAlpha: 0 })
        // scroll: the drawing drifts up a little as the hero leaves
        gsap.to('[data-sk-art]', { yPercent: -8, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true } })
        if (!play) return

        // idle life (created up-front so useGSAP reverts it; started when the drawing is done)
        const steam = gsap.timeline({ paused: true, repeat: -1 })
        steam
          .fromTo('[data-sk-steam] path', { drawSVG: '0% 0%' }, { drawSVG: '0% 100%', duration: 1.1, ease: 'sine.inOut', stagger: 0.25 })
          .to('[data-sk-steam] path', { drawSVG: '100% 100%', duration: 1.1, ease: 'sine.inOut', stagger: 0.25 }, '>-0.2')
        const items = gsap.utils.toArray<SVGGElement>('[data-sk-item]').slice(1)
        const bobs = items.map((el, i) =>
          gsap.to(el, { y: -6, rotate: i % 2 ? 1.2 : -1.2, svgOrigin: '300 432', duration: 1.6 + i * 0.25, ease: 'sine.inOut', yoyo: true, repeat: -1, paused: true }),
        )
        const twinkle = gsap.to('[data-sk-spark]', { scale: 0.6, transformOrigin: '50% 50%', duration: 0.9, ease: 'sine.inOut', yoyo: true, repeat: -1, stagger: 0.4, paused: true })

        gsap
          .timeline({ delay: 0.05 })
          .to('[data-hn-line]', { yPercent: 0, duration: DUR.hero, ease: EASE.out, stagger: 0.12 })
          .from('[data-hn-fade]', { y: 16, autoAlpha: 0, duration: DUR.base, ease: EASE.out, stagger: 0.08 }, 0.4)
          .to('[data-sk-line]', { drawSVG: '100%', duration: 0.7, ease: 'power2.inOut', stagger: 0.045 }, 0.2)
          .to('[data-sk-fill]', { autoAlpha: 1, x: 0, y: 0, duration: 0.5, ease: EASE.out, stagger: 0.18 }, '-=0.5')
          .to('[data-sk-arrow]', { drawSVG: '100%', duration: 0.5, ease: 'power2.out', stagger: 0.15 }, '-=0.2')
          .to('[data-sk-note]', { autoAlpha: 1, duration: DUR.base, stagger: 0.15 }, '<')
          .to('[data-sk-spark]', { autoAlpha: 1, duration: 0.3, stagger: 0.1 }, '<')
          .add(() => [steam, twinkle, ...bobs].forEach((t) => t.play()), '+=0.1')
      })
    },
    { scope: ref, dependencies: [play], revertOnUpdate: true },
  )

  return (
    <section ref={ref} aria-label="Welcome" className="grain relative overflow-hidden bg-oat px-4 pt-24 pb-16 sm:px-6 md:pt-32 lg:min-h-dvh">
      <div className="relative mx-auto grid max-w-7xl items-center gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
        <div>
          <div data-hn-fade>
            <HeroMeta />
          </div>
          <p data-hn-fade className="mt-8 -rotate-2 font-hand text-3xl text-ink sm:text-4xl">
            Bhook lagi? We got you.
          </p>
          <h1 className="mt-2 font-display text-[clamp(4.25rem,19vw,8rem)] leading-[0.86] font-extrabold tracking-[-0.045em] lg:text-[clamp(6rem,9vw,9.5rem)]">
            {LINES.map((l) => (
              <span key={l.text} className="flex items-center gap-[0.12em]">
                <span className="block overflow-hidden pr-[0.06em] pb-[0.08em]">
                  <span data-hn-line className={cn('block', l.className)}>
                    {l.text}
                  </span>
                </span>
                {'munch' in l && (
                  <span aria-hidden="true" className={cn('relative inline-block shrink-0', MUNCH_SIZE_CLASS)}>
                    <MunchStop stop={1} />
                  </span>
                )}
              </span>
            ))}
          </h1>
          <p data-hn-fade className="mt-7 max-w-md text-lg font-medium text-ink sm:text-xl">
            {site.heroLine}
          </p>
          <div data-hn-fade className="mt-8 flex flex-wrap items-center gap-3 md:mt-28">
            <HeroOrderPeek play={play}>
              <MagneticButton>
                <Button size="lg" onClick={toMenu}>
                  Order Now
                </Button>
              </MagneticButton>
            </HeroOrderPeek>
            <ButtonLink to="/menu" size="lg" variant="outline">
              See the Menu
            </ButtonLink>
          </div>
        </div>
        <HeroSketch />
      </div>
    </section>
  )
}
