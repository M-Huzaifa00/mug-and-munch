import { useLenis } from 'lenis/react'
import { site } from '@/config/site'
import { Button, ButtonLink } from '@/components/ui/Button'
import { MagneticButton } from '@/components/ui/MagneticButton'
import { HeroBackdrop } from './HeroBackdrop'
import { HERO_CINEMA_ID, HeroCinema } from './HeroCinema'
import { HeroHeadline } from './HeroHeadline'
import { HeroMascot } from './HeroMascot'
import { HeroMeta } from './HeroMeta'
import { HeroSpinBadge } from './HeroSpinBadge'
import { SECTION_IDS } from '../sectionIds'

/**
 * Home hero, "Golden Hour Stage": live info row → "Bhook lagi?" → picture-typography headline (photo capsules
 * inside SIP. BITE. REPEAT., the Munch Run burger parked after REPEAT.) → line + CTAs → the golden-hour cinema
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
          {/* fills the empty right side of the headline on desktop */}
          <HeroSpinBadge targetId={HERO_CINEMA_ID} className="absolute top-1/2 right-0 hidden -translate-y-1/2 xl:flex" />
        </div>
        <div className="mt-8 flex flex-col gap-6 md:mt-10 md:flex-row md:items-end md:justify-between">
          <p className="max-w-md text-lg font-medium text-ink sm:text-xl">{site.heroLine}</p>
          <div className="flex flex-wrap items-center gap-3">
            <MagneticButton>
              <Button size="lg" onClick={toMenu}>
                Order Now
              </Button>
            </MagneticButton>
            <ButtonLink to="/menu" size="lg" variant="outline">
              See the Menu
            </ButtonLink>
          </div>
        </div>
        <HeroCinema play={play} />
      </div>

      {play && <HeroMascot />}
    </section>
  )
}
