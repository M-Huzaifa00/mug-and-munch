import { useCallback } from 'react'
import { confettiBurst } from '@/lib/celebrate'
import { notify } from '@/lib/notify'
import { useCart, type AddItemInput } from '@/store/cart'
import { useFlyToCart } from './useFlyToCart'
import { useReducedMotion } from './useReducedMotion'

interface AddOptions {
  qty?: number
  /** Element to clone for the fly-to-cart arc (usually the product image). */
  source?: HTMLElement | null
}

/**
 * The ONE way to add to cart from UI: store update → fly-to-cart arc → jelly bounce →
 * first-add-of-session confetti → "Nice pick!" toast with Undo.
 * Reduced motion: toast only.
 */
export function useAddToCart() {
  const fly = useFlyToCart()
  const reduced = useReducedMotion()

  return useCallback(
    (input: AddItemInput, { qty = 1, source }: AddOptions = {}) => {
      const { addItem, undoLastAdd, isOpen } = useCart.getState()
      const { isFirstAdd } = addItem(input, qty)

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
