import { lazy, Suspense, useState } from 'react'
import { useLocation } from 'react-router'
import { site } from '@/config/site'
import { shouldShowPreloader } from '@/lib/preloader'
import { LazyMount } from '@/components/ui/LazyMount'
import { Seo } from '@/components/layout/Seo'
import { Bestsellers } from '@/sections/home/Bestsellers'
import { DealsStrip } from '@/sections/home/deals/DealsStrip'
import { FindUsTeaser } from '@/sections/home/FindUsTeaser'
import { Hero } from '@/sections/home/hero/Hero'
import { Marquee } from '@/sections/home/Marquee'
import { MenuPreview } from '@/sections/home/MenuPreview'
import { Preloader } from '@/sections/home/Preloader'
import { Reviews } from '@/sections/home/reviews/Reviews'
import { SnackRoulette } from '@/sections/home/roulette/SnackRoulette'
import { SECTION_IDS } from '@/sections/home/sectionIds'
import { VibePicker } from '@/sections/home/vibe/VibePicker'

// Lazy chunk, mounted only near the viewport (or immediately for a #craft-* deep link).
const CraftSection = lazy(() => import('@/sections/home/craft/CraftSection').then((m) => ({ default: m.CraftSection })))
const CRAFT_SPACE = 'min(100dvh, 900px)'

/**
 * Home: Preloader → Hero → Marquee → MenuPreview → Bestsellers → Craft your own (coffee / burger / wrap)
 * → Vibe Picker → Snack Roulette → Deals → Reviews → Find Us → (Footer).
 */
export function Home() {
  const [preloading, setPreloading] = useState(shouldShowPreloader)
  const { hash } = useLocation()

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
      <LazyMount minHeight={CRAFT_SPACE} eager={hash.startsWith('#craft')} id={SECTION_IDS.craft} className="bg-espresso">
        <Suspense fallback={<div className="bg-espresso" style={{ minHeight: CRAFT_SPACE }} />}>
          <CraftSection />
        </Suspense>
      </LazyMount>
      <VibePicker />
      <SnackRoulette />
      <DealsStrip />
      <Reviews />
      <FindUsTeaser />
    </>
  )
}
