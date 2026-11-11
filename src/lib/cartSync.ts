import { notify } from '@/lib/notify'
import { useCart } from '@/store/cart'

/**
 * Bring the persisted cart in line with the CURRENT menu data, with one honest notice:
 * lines that can't be ordered any more (item removed from the menu, price not set yet, maker turned off,
 * deal gone, option removed) are taken out; changed prices are updated.
 * Called on app start (RootLayout), when the drawer / checkout opens, and right before sending an order.
 */
export function syncCart(): { removed: string[]; priceChanged: boolean } {
  const result = useCart.getState().reprice()
  const { removed, priceChanged } = result
  if (removed.length === 1) notify(`${removed[0]} isn't on the menu right now, so we took it out of your cart.`, { id: 'cart-sync' })
  else if (removed.length > 1) notify(`${removed.length} items aren't on the menu right now, so we took them out of your cart.`, { id: 'cart-sync' })
  else if (priceChanged) notify('Some prices were updated.', { id: 'cart-sync' })
  return result
}
