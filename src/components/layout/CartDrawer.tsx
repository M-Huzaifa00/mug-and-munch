import { useEffect } from 'react'
import { AnimatePresence } from 'motion/react'
import { useLocation } from 'react-router'
import { useCart } from '@/store/cart'
import { Drawer } from '@/components/ui/Drawer'
import { CartContents } from './cart/CartContents'

/** Global cart drawer (state lives in the cart store: isOpen / openCart / closeCart). */
export function CartDrawer() {
  const isOpen = useCart((s) => s.isOpen)
  const closeCart = useCart((s) => s.closeCart)
  const { pathname } = useLocation()

  // Navigating anywhere closes the drawer.
  useEffect(() => {
    closeCart()
  }, [pathname, closeCart])

  return (
    <AnimatePresence>
      {isOpen && (
        <Drawer onClose={closeCart} labelledBy="cart-title">
          <CartContents onClose={closeCart} />
        </Drawer>
      )}
    </AnimatePresence>
  )
}
