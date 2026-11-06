import { useState } from 'react'
import { site } from '@/config/site'
import { shouldShowPreloader } from '@/lib/preloader'
import { Seo } from '@/components/layout/Seo'
import { Bestsellers } from '@/sections/home/Bestsellers'
import { BuildYourBurger } from '@/sections/home/burger/BuildYourBurger'
import { CoffeeLab } from '@/sections/home/coffee/CoffeeLab'
import { SnackRoulette } from '@/sections/home/roulette/SnackRoulette'
import { VibePicker } from '@/sections/home/vibe/VibePicker'
import { WrapItUp } from '@/sections/home/wrap/WrapItUp'
import { DealsStrip } from '@/sections/home/deals/DealsStrip'
import { FindUsTeaser } from '@/sections/home/FindUsTeaser'
import { Hero } from '@/sections/home/hero/Hero'
import { Marquee } from '@/sections/home/Marquee'
import { MenuPreview } from '@/sections/home/MenuPreview'
import { Preloader } from '@/sections/home/Preloader'
import { Reviews } from '@/sections/home/reviews/Reviews'

/**
 * Home: Preloader → Hero → Marquee → MenuPreview → Bestsellers → Deals → Reviews → Find Us → (Footer).
 * Phase 4 toys (Build Your Burger, Coffee Lab, Wrap It Up, Vibe Picker, Roulette) slot in later.
 */
export function Home() {
  const [preloading, setPreloading] = useState(shouldShowPreloader)

  return (
    <>
      <Seo
        description={`${site.brandName}: Islamabad's late-night coffee & smash spot. Lattes, smash burgers and wraps for delivery, takeaway or dine-in.`}
        path="/"
      />
      {preloading && <Preloader onDone={() => setPreloading(false)} />}
      <Hero play={!preloading} />
      <Marquee />
      <MenuPreview />
      <Bestsellers />
      <BuildYourBurger />
      <CoffeeLab />
      <WrapItUp />
      <VibePicker />
      <SnackRoulette />
      <DealsStrip />
      <Reviews />
      <FindUsTeaser />
    </>
  )
}
