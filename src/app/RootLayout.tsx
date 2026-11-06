import { Suspense } from 'react'
import { AnimatePresence } from 'motion/react'
import { useLocation, useRoutes } from 'react-router'
import { getBackgroundLocation, getModalSlug } from '@/lib/routing'
import { ItemModal } from '@/components/item/ItemModal'
import { CartDrawer } from '@/components/layout/CartDrawer'
import { Footer } from '@/components/layout/Footer'
import { JsonLd } from '@/components/layout/JsonLd'
import { MobileBottomBar } from '@/components/layout/MobileBottomBar'
import { Navbar } from '@/components/layout/Navbar'
import { PageLoader } from '@/components/layout/PageLoader'
import { ScrollToTop } from '@/components/layout/ScrollToTop'
import { WhatsAppFab } from '@/components/layout/WhatsAppFab'
import { PAGE_ROUTES } from './routes'

export function RootLayout() {
  const location = useLocation()
  const background = getBackgroundLocation(location)
  const modalSlug = getModalSlug(location)
  // With a background location, keep rendering that page underneath the item modal.
  const page = useRoutes(PAGE_ROUTES, modalSlug && background ? background : location)

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
        <Suspense fallback={<PageLoader />}>{page}</Suspense>
      </main>
      <Footer />
      <MobileBottomBar />
      <WhatsAppFab />
      <CartDrawer />
      <AnimatePresence>{modalSlug && <ItemModal key="item-modal" slug={modalSlug} />}</AnimatePresence>
    </div>
  )
}
