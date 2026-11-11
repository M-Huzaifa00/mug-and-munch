import { Suspense, useEffect, useRef } from 'react'
import { AnimatePresence } from 'motion/react'
import { useLocation, useRoutes } from 'react-router'
import { syncCart } from '@/lib/cartSync'
import { markPageReady, removeBootScreen, usePreloaderPhase } from '@/lib/preloader'
import { getBackgroundLocation, getModalSlug } from '@/lib/routing'
import { ItemModal } from '@/components/item/ItemModal'
import { CartDrawer } from '@/components/layout/CartDrawer'
import { CoffeeSpill } from '@/components/layout/CoffeeSpill'
import { PageTransition } from '@/components/layout/PageTransition'
import { Footer } from '@/components/layout/Footer'
import { JsonLd } from '@/components/layout/JsonLd'
import { MobileBottomBar } from '@/components/layout/MobileBottomBar'
import { Navbar } from '@/components/layout/Navbar'
import { Preloader } from '@/components/layout/Preloader'
import { ScrollToTop } from '@/components/layout/ScrollToTop'
import { WhatsAppFab } from '@/components/layout/WhatsAppFab'
import { Cursor } from './providers/Cursor'
import { PAGE_ROUTES, prefetchPages } from './routes'

/** Renders inside the page Suspense boundary → its effect runs once the routed page has mounted. */
function PageReady() {
  useEffect(() => markPageReady(), [])
  return null
}

export function RootLayout() {
  const location = useLocation()
  const background = getBackgroundLocation(location)
  const modalSlug = getModalSlug(location)
  // With a background location, keep rendering that page underneath the item modal.
  const page = useRoutes(PAGE_ROUTES, modalSlug && background ? background : location)
  // Every full load: the 0→100 preloader is the ONLY loading screen (no Suspense loader anywhere).
  const preloader = usePreloaderPhase()
  const booted = useRef(false)
  useEffect(() => {
    if (preloader !== 'done' || booted.current) return
    booted.current = true
    removeBootScreen()
    // A saved cart may hold items that are no longer on the menu (or have no price yet): drop them now (the
    // badge / pill never count them), with one notice, after the curtain so the toast isn't hidden behind it.
    syncCart()
    // Warm the other page chunks on idle so in-app navigation never waits.
    const idle = window.requestIdleCallback?.bind(window) ?? ((cb: () => void) => window.setTimeout(cb, 1200))
    idle(() => prefetchPages())
  }, [preloader])

  return (
    <div className="pb-safe-bar flex min-h-dvh flex-col md:pb-0">
      <a
        href="#main"
        className="sticker sr-only z-[100] rounded-full bg-cheese px-4 py-2 font-bold text-espresso focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <JsonLd />
      <ScrollToTop />
      <Navbar />
      <main id="main" className="flex-1">
        {/* No loading screen here: first load = the preloader; later chunks are prefetched (blank oat at worst). */}
        <Suspense fallback={<div className="min-h-dvh" />}>
          {page}
          <PageReady />
        </Suspense>
      </main>
      {preloader !== 'done' && <Preloader />}
      <Footer />
      <MobileBottomBar />
      <WhatsAppFab />
      <CartDrawer />
      <PageTransition />
      <CoffeeSpill />
      <Cursor />
      <AnimatePresence>{modalSlug && <ItemModal key="item-modal" slug={modalSlug} />}</AnimatePresence>
    </div>
  )
}
