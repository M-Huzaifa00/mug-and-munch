import { Suspense, useEffect } from 'react'
import { AnimatePresence } from 'motion/react'
import { useLocation, useRoutes } from 'react-router'
import { removeBootScreen, usePreloaderPhase } from '@/lib/preloader'
import { getBackgroundLocation, getModalSlug } from '@/lib/routing'
import { ItemModal } from '@/components/item/ItemModal'
import { CartDrawer } from '@/components/layout/CartDrawer'
import { CoffeeSpill } from '@/components/layout/CoffeeSpill'
import { PageTransition } from '@/components/layout/PageTransition'
import { Footer } from '@/components/layout/Footer'
import { JsonLd } from '@/components/layout/JsonLd'
import { MobileBottomBar } from '@/components/layout/MobileBottomBar'
import { Navbar } from '@/components/layout/Navbar'
import { PageLoader } from '@/components/layout/PageLoader'
import { Preloader } from '@/components/layout/Preloader'
import { ScrollToTop } from '@/components/layout/ScrollToTop'
import { WhatsAppFab } from '@/components/layout/WhatsAppFab'
import { Cursor } from './providers/Cursor'
import { PAGE_ROUTES } from './routes'

export function RootLayout() {
  const location = useLocation()
  const background = getBackgroundLocation(location)
  const modalSlug = getModalSlug(location)
  // With a background location, keep rendering that page underneath the item modal.
  const page = useRoutes(PAGE_ROUTES, modalSlug && background ? background : location)
  // First Home visit: the 0→100 preloader is the ONLY loading screen (no Suspense logo before it).
  const preloader = usePreloaderPhase()
  useEffect(() => {
    if (preloader === 'done') removeBootScreen()
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
        <Suspense fallback={preloader === 'done' ? <PageLoader /> : null}>{page}</Suspense>
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
