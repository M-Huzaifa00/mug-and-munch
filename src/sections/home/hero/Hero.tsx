import { useLenis } from 'lenis/react'
import { site } from '@/config/site'
import { Button, ButtonLink } from '@/components/ui/Button'
import { MagneticButton } from '@/components/ui/MagneticButton'
import { HeroBackdrop } from './HeroBackdrop'
import { HeroHeadline } from './HeroHeadline'
import { HeroMascot } from './HeroMascot'
import { HeroVisuals } from './HeroVisuals'
import { ScrollHint } from './ScrollHint'
import { SECTION_IDS } from '../sectionIds'

/** Home hero. `play` = false while the preloader is on screen (intro waits for it). */
export function Hero({ play }: { play: boolean }) {
  const lenis = useLenis()

  const toMenu = () => {
    const el = document.getElementById(SECTION_IDS.menuPreview)
    if (!el) return
    if (lenis) lenis.scrollTo(el, { offset: -20, duration: 1.4 })
    else el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section aria-label="Welcome" className="grain relative overflow-hidden bg-oat px-4 pt-28 pb-24 sm:px-6 md:min-h-dvh md:pb-20">
      <HeroBackdrop />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 md:min-h-[calc(100dvh-12rem)] md:grid-cols-[1.05fr_0.95fr] md:gap-12">
        <div>
          <p className="-rotate-2 font-hand text-3xl text-ink sm:text-4xl">Bhook lagi? We got you.</p>
          <HeroHeadline play={play} />
          <p className="mt-6 max-w-md text-lg font-medium text-ink sm:text-xl">{site.heroLine}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
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
        <HeroVisuals play={play} />
      </div>

      {play && <HeroMascot />}
      <ScrollHint />
    </section>
  )
}
