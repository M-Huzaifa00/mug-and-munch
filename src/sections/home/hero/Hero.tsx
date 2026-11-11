import { useRef } from 'react'
import { useLenis } from 'lenis/react'
import { site } from '@/config/site'
import { MUNCH_SIZE_CLASS } from '@/data/munchRun'
import { gsap, MQ, useGSAP } from '@/lib/gsap'
import { getOpenStatus } from '@/lib/hours'
import { DUR, EASE } from '@/lib/motion-presets'
import { cn } from '@/lib/utils'
import { Button, ButtonLink } from '@/components/ui/Button'
import { MagneticButton } from '@/components/ui/MagneticButton'
import { MunchStop } from '@/components/munchRun/MunchStop'
import { SECTION_IDS } from '../sectionIds'
import { HeroMeta } from './HeroMeta'
import { HeroOrderPeek } from './HeroOrderPeek'
import { HeroSketch } from './HeroSketch'
import { OrderAgain } from './OrderAgain'
import { useSketchMotion } from './useSketchMotion'

const LINES = [
  { text: 'SIP.', className: 'text-espresso' },
  { text: 'BITE.', className: 'text-chili' },
  { text: 'REPEAT.', className: 'text-espresso [text-shadow:0.05em_0.05em_0_var(--color-cheese)]', munch: true },
] as const

/**
 * Home hero "The Sketch" (owner pick, 2026-11-12). Left: the owner's copy, stacked type rising out of masks,
 * Order Now with the Munchy peek (+ an honest "closed, opens at…" note), and "Order again" for returning
 * visitors. Right: the logo's tray as a live ink drawing (motion in useSketchMotion; on a full load of Home the
 * preloader's drawing lands on it). The Munch Run slot after REPEAT. is desktop/tablet only (no Munch Run on phones).
 */
export function Hero({ play }: { play: boolean }) {
  const ref = useRef<HTMLElement>(null)
  const lenis = useLenis()
  const status = getOpenStatus()
  useSketchMotion(ref, play)

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
        if (!play) return
        gsap
          .timeline({ delay: 0.05 })
          .to('[data-hn-line]', { yPercent: 0, duration: DUR.hero, ease: EASE.out, stagger: 0.12 })
          .from('[data-hn-fade]', { y: 16, autoAlpha: 0, duration: DUR.base, ease: EASE.out, stagger: 0.08 }, 0.4)
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
          <p data-hn-fade className="mt-6 -rotate-2 font-hand text-3xl text-ink sm:mt-8 sm:text-4xl">
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
                  <span aria-hidden="true" className={cn('relative hidden shrink-0 md:inline-block', MUNCH_SIZE_CLASS)}>
                    <MunchStop stop={1} />
                  </span>
                )}
              </span>
            ))}
          </h1>
          <p data-hn-fade className="mt-6 max-w-md text-lg font-medium text-ink sm:mt-7 sm:text-xl">
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
          {!status.isOpen && (
            <p data-hn-fade className="mt-4 max-w-md text-sm text-ink/75">
              😴 Closed right now{status.detail ? `, ${status.detail}` : ''}. You can still send your order; we&apos;ll confirm it when we open.
            </p>
          )}
          <OrderAgain />
        </div>
        <HeroSketch />
      </div>
    </section>
  )
}
