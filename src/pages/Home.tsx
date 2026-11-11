import { lazy, Suspense, useEffect } from 'react'
import { useIdleMount } from '@/hooks/useIdleMount'
import { useLocation } from 'react-router'
import { site } from '@/config/site'
import { markHomeReady, usePreloaderPhase } from '@/lib/preloader'
import { LazyMount } from '@/components/ui/LazyMount'
import { Seo } from '@/components/layout/Seo'
import { Bestsellers } from '@/sections/home/Bestsellers'
import { DealsStrip } from '@/sections/home/deals/DealsStrip'
import { FindUsTeaser } from '@/sections/home/FindUsTeaser'
import { Hero } from '@/sections/home/hero/Hero'
import { Marquee } from '@/sections/home/Marquee'
import { MenuPreview } from '@/sections/home/MenuPreview'
import { Reviews } from '@/sections/home/reviews/Reviews'
import { SnackRoulette } from '@/sections/home/roulette/SnackRoulette'
import { SECTION_IDS } from '@/sections/home/sectionIds'
import { VibePicker } from '@/sections/home/vibe/VibePicker'

// Lazy chunk, mounted only near the viewport (or immediately for a #craft-* deep link).
const CraftSection = lazy(() => import('@/sections/home/craft/CraftSection').then((m) => ({ default: m.CraftSection })))
// svh, not dvh: dvh changes as the phone's URL bar collapses mid-scroll, resizing this placeholder under the finger.
const CRAFT_SPACE = 'min(100svh, 900px)'
// Decorative Munch Run traveler: its own chunk, loaded after the preloader on idle (never affects LCP).
const MunchRun = lazy(() => import('@/components/munchRun/MunchRun').then((m) => ({ default: m.MunchRun })))

/**
 * Home: (shell Preloader) → Hero → Marquee → MenuPreview → Bestsellers → Craft your own (coffee / burger / wrap)
 * → Vibe Picker → Snack Roulette → Deals → Reviews → Find Us → (Footer).
 */
export function Home() {
  // The preloader lives in the app shell; Home tells it when it's mounted, and starts its intro as the curtain lifts.
  const preloading = usePreloaderPhase() === 'loading'
  useEffect(() => markHomeReady(), [])
  const { hash } = useLocation()
  const munchReady = useIdleMount(!preloading)

  return (
    <>
      <Seo
        description={`${site.brandName}: Islamabad's late-night coffee & smash spot. Lattes, smash burgers and wraps for delivery, takeaway or dine-in.`}
        path="/"
      />
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
      {munchReady && (
        <Suspense fallback={null}>
          <MunchRun />
        </Suspense>
      )}
    </>
  )
}
