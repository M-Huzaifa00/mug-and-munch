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
import { HeroArch } from './HeroArch'

const LINES = [
  { text: 'SIP.', className: 'text-espresso' },
  { text: 'BITE.', className: 'text-chili' },
  // hard cheese offset shadow (sticker type): a text-stroke outline showed the variable font's overlapping contours
  { text: 'REPEAT.', className: 'text-espresso [text-shadow:0.05em_0.05em_0_var(--color-cheese)]', munch: true },
] as const

/**
 * NEW hero candidate ("calm editorial"), shown with ?hero=new (DEV toggle) while the owner compares.
 * Left: live info row, "Bhook lagi?", giant stacked SIP. / BITE. / outlined REPEAT. (lines rise out of masks;
 * the Munch Run burger parks after REPEAT., its slot sits OUTSIDE the animated text so the anchor never moves),
 * line + Order Now (Munchy peeks: "psst… order here!") + See the Menu. Right: one tall arch window with the photo.
 * No pills, no colour wash, no cinema panel. Reduced motion: static.
 */
export function HeroAlt({ play }: { play: boolean }) {
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
        gsap.set('[data-line]', { yPercent: 110 })
        gsap.set('[data-arch]', { clipPath: 'inset(100% 0% 0% 0%)' })
        gsap.set('[data-arch-img]', { scale: 1.1 })
        if (play) {
          gsap
            .timeline({ delay: 0.05 })
            .to('[data-line]', { yPercent: 0, duration: DUR.hero, ease: EASE.out, stagger: 0.12 })
            .to('[data-arch]', { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: EASE.inOut, clearProps: 'clipPath' }, 0.2)
            .from('[data-arch-img]', { scale: 1.35, duration: DUR.hero * 1.5, ease: EASE.out }, 0.2)
            .from('[data-fade]', { y: 18, autoAlpha: 0, duration: DUR.base, ease: EASE.out, stagger: 0.08 }, 0.55)
        }
        gsap.fromTo('[data-arch-img]', { yPercent: -4 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true } })
      })
    },
    { scope: ref, dependencies: [play], revertOnUpdate: true },
  )

  return (
    <section ref={ref} aria-label="Welcome" className="grain relative overflow-hidden bg-oat px-4 pt-24 pb-20 sm:px-6 md:pt-32 lg:min-h-dvh">
      <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
        <div>
          <div data-fade>
            <HeroMeta />
          </div>
          <p data-fade className="mt-8 -rotate-2 font-hand text-3xl text-ink sm:text-4xl">
            Bhook lagi? We got you.
          </p>
          <h1 className="mt-2 font-display text-[clamp(4.25rem,19vw,8rem)] leading-[0.86] font-extrabold tracking-[-0.045em] lg:text-[clamp(6rem,9vw,9.75rem)]">
            {LINES.map((l) => (
              <span key={l.text} className="flex items-center gap-[0.12em]">
                {/* mask with room on the right/bottom for the offset shadow */}
                <span className="block overflow-hidden pr-[0.06em] pb-[0.08em]">
                  <span data-line className={cn('block', l.className)}>
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
          <p data-fade className="mt-7 max-w-md text-lg font-medium text-ink sm:text-xl">
            {site.heroLine}
          </p>
          <div data-fade className="mt-8 flex flex-wrap items-center gap-3 md:mt-28">
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
        <HeroArch />
      </div>
    </section>
  )
}
