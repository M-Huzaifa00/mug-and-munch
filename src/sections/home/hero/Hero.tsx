import { useLenis } from 'lenis/react'
import { site } from '@/config/site'
import { Button, ButtonLink } from '@/components/ui/Button'
import { MagneticButton } from '@/components/ui/MagneticButton'
import { Sticker } from '@/components/ui/Sticker'
import { HeroBackdrop } from './HeroBackdrop'
import { HeroCinema } from './HeroCinema'
import { HeroHeadline } from './HeroHeadline'
import { HeroMeta } from './HeroMeta'
import { HeroOrderPeek } from './HeroOrderPeek'
import { SECTION_IDS } from '../sectionIds'

/**
 * Home hero, "Golden Hour Stage": live info row → "Bhook lagi?" → picture-typography headline (photo capsules
 * inside SIP. BITE. REPEAT., the Munch Run burger parked after REPEAT.) → line + CTAs (Munchy peeks from behind
 * Order Now: "psst… order here!") → the golden-hour cinema
 * panel that grows to full width on scroll. Warm photo-colour wash behind it all.
 * `play` = false while the preloader is on screen (intro waits for it).
 */
export function Hero({ play }: { play: boolean }) {
  const lenis = useLenis()

  const toMenu = () => {
    const el = document.getElementById(SECTION_IDS.menuPreview)
    if (!el) return
    if (lenis) lenis.scrollTo(el, { offset: -20, duration: 1.4 })
    else el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section aria-label="Welcome" className="grain relative overflow-hidden bg-oat px-4 pt-24 pb-20 sm:px-6 md:pt-32 md:pb-24">
      <HeroBackdrop />

      <div className="relative mx-auto max-w-7xl">
        <HeroMeta />
        <p className="mt-6 mb-2 -rotate-2 font-hand text-3xl text-ink sm:text-4xl md:mt-8 md:mb-4">Bhook lagi? We got you.</p>
        <div className="relative">
          <HeroHeadline play={play} />
          {/* two quiet brand stickers balance the empty space right of the headline (desktop only) */}
          <Sticker kind="sparkle" tilt={-10} className="top-[6%] right-[14%] hidden size-16 lg:block" />
          <Sticker kind="star" tilt={12} className="right-[4%] bottom-[14%] hidden lg:block" />
        </div>
        <div className="mt-8 flex flex-col gap-6 md:mt-10 md:flex-row md:items-end md:justify-between">
          <p className="max-w-md text-lg font-medium text-ink sm:text-xl">{site.heroLine}</p>
          <div className="flex flex-wrap items-center gap-3">
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
        <HeroCinema play={play} />
      </div>

    </section>
  )
}
