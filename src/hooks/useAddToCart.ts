import { useCallback } from 'react'
import { confettiBurst } from '@/lib/celebrate'
import { priceLine } from '@/lib/itemOptions'
import { notify } from '@/lib/notify'
import { useCart, type AddItemInput } from '@/store/cart'
import { useFlyToCart } from './useFlyToCart'
import { useReducedMotion } from './useReducedMotion'

interface AddOptions {
  qty?: number
  /** Element to clone for the fly-to-cart arc (usually the product image). */
  source?: HTMLElement | null
  /** Edit / Tweak: replace this line instead of adding a new one. */
  replaceLineId?: string
}

/**
 * The ONE way to add to cart from UI: store update → fly-to-cart arc → jelly bounce →
 * first-add-of-session confetti → haptic tick (Android) → "Nice pick!" toast with Undo.
 * Reduced motion: toast only.
 */
export function useAddToCart() {
  const fly = useFlyToCart()
  const reduced = useReducedMotion()

  return useCallback(
    (raw: AddItemInput, { qty = 1, source, replaceLineId }: AddOptions = {}) => {
      // Last line of defence: only things orderable from the CURRENT data reach the cart, at the data's price.
      const check = priceLine(raw)
      if (!check.available) {
        notify(`Sorry, ${raw.name} isn't available to order right now.`, { id: 'cart-add' })
        return
      }
      const input: AddItemInput = { ...raw, unitPrice: check.unitPrice }
      const { addItem, replaceItem, undoLastAdd, isOpen, items } = useCart.getState()
      if (replaceLineId && items.some((i) => i.lineId === replaceLineId)) {
        replaceItem(replaceLineId, input)
        fly(source)
        notify(`Updated ✨ ${input.name}`, { id: 'cart-add' })
        return
      }
      const { isFirstAdd } = addItem(input, qty)
      // Tiny haptic tick on Android (iOS Safari has no vibrate API; skipped for reduced motion).
      if (!reduced && 'vibrate' in navigator) navigator.vibrate(12)

      // Don't fly behind the open drawer's backdrop.
      const flew = !isOpen && fly(source, {
        onLand: (target) => {
          if (!isFirstAdd) return
          const r = target.getBoundingClientRect()
          void confettiBurst(r.left + r.width / 2, r.top + r.height / 2)
        },
      })
      if (!flew && isFirstAdd && !reduced && !isOpen) {
        void confettiBurst(window.innerWidth / 2, window.innerHeight * 0.35)
      }

      // Single toast id → the visible Undo always refers to the latest add.
      notify(`Nice pick! 🔥 ${input.name} added`, { id: 'cart-add', undo: () => undoLastAdd() })
    },
    [fly, reduced],
  )
}
