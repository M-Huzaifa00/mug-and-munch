import { AnimatePresence, motion } from 'motion/react'
import { BrandImage } from '@/components/brand/BrandImage'
import { NavLink } from 'react-router'
import { useIsCheckout } from '@/hooks/useIsCheckout'
import { useIsItemPage } from '@/hooks/useIsItemPage'
import { useCart, useCartCount, useCartSubtotal } from '@/store/cart'
import { cn, formatPKR } from '@/lib/utils'
import { SPRING, TAP_SQUISH } from '@/lib/motion-presets'
import { RollingNumber } from '@/components/ui/RollingNumber'
import { TAB_LINKS } from './navLinks'

/** Mobile-only bottom tab bar + floating "View cart · Rs X" pill when the cart has items. */
export function MobileBottomBar() {
  const count = useCartCount()
  const subtotal = useCartSubtotal()
  const openCart = useCart((s) => s.openCart)
  // The full item page has its own sticky "Add to cart" bar in this spot.
  const isItemPage = useIsItemPage()
  // Checkout has its own sticky "Send order on WhatsApp" bar.
  const isCheckout = useIsCheckout()

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 md:hidden">
      <AnimatePresence>
        {count > 0 && !isItemPage && !isCheckout && (
          <motion.div
            key="cart-pill"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={SPRING.bouncy}
            className="pointer-events-none absolute right-3 bottom-[calc(100%+0.75rem)] left-3"
          >
            <motion.button
              type="button"
              onClick={openCart}
              whileTap={TAP_SQUISH}
              aria-haspopup="dialog"
              className="sticker pointer-events-auto flex min-h-14 w-full items-center justify-between gap-2 rounded-full bg-chili py-2 pr-5 pl-2 font-display text-[1.1875rem] font-extrabold text-oat"
            >
              <span className="flex size-10 items-center justify-center rounded-full border-2 border-espresso bg-cheese text-sm text-espresso">
                <RollingNumber value={Math.min(count, 99)} />
              </span>
              <span className="flex flex-1 items-center justify-center gap-2">
                <span className="flex size-8 items-center justify-center rounded-full border-2 border-espresso bg-oat">
                  <BrandImage kind="icon" height={22} alt="" />
                </span>
                <span>
                  View cart · <RollingNumber value={subtotal} format={formatPKR} />
                </span>
              </span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <nav aria-label="Quick" className="glass border-t-[2.5px] border-espresso pb-[env(safe-area-inset-bottom)]">
        <ul className="grid grid-cols-4">
          {TAB_LINKS.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === '/'}
                className="group flex min-h-16 flex-col items-center justify-center gap-0.5 text-xs font-bold text-espresso"
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={cn(
                        'flex h-8 w-14 items-center justify-center rounded-full transition-colors duration-200',
                        isActive ? 'bg-cheese' : 'group-active:bg-espresso/10',
                      )}
                    >
                      <Icon size={20} strokeWidth={isActive ? 2.6 : 2} aria-hidden="true" />
                    </span>
                    {label}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
