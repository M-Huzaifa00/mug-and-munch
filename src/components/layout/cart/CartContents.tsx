import { AnimatePresence } from 'motion/react'
import { X } from 'lucide-react'
import { notify } from '@/lib/notify'
import { useCart, useCartCount, type CartItem } from '@/store/cart'
import { ButtonLink } from '@/components/ui/Button'
import { Logo } from '@/components/brand/Logo'
import { Munchy } from '@/components/mascot/Munchy'
import { CartLineItem } from './CartLineItem'
import { CartSummary } from './CartSummary'
import { CartUpsell } from './CartUpsell'
import { FreeDeliveryBar } from './FreeDeliveryBar'

/** Header + (empty state | free-delivery bar, lines, upsell, summary). */
export function CartContents({ onClose }: { onClose: () => void }) {
  const items = useCart((s) => s.items)
  const updateQty = useCart((s) => s.updateQty)
  const count = useCartCount()

  const remove = (item: CartItem) => {
    const { items: current, removeItem, restoreItem } = useCart.getState()
    const index = current.findIndex((i) => i.lineId === item.lineId)
    removeItem(item.lineId)
    notify(`Removed ${item.name}`, { id: 'cart-remove', undo: () => restoreItem(item, index) })
  }

  return (
    <>
      <header className="flex items-center justify-between gap-3 border-b-2 border-espresso/10 px-4 pt-2 pb-3 md:pt-5">
        <h2 id="cart-title" className="font-display text-3xl font-extrabold text-espresso">
          Your cart{count > 0 && <span className="ml-2 align-middle text-base font-bold text-ink/70">({count})</span>}
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close cart"
          className="flex size-11 items-center justify-center rounded-full border-2 border-espresso text-espresso transition-transform hover:rotate-90"
        >
          <X size={20} strokeWidth={2.8} aria-hidden="true" />
        </button>
      </header>

      {items.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 py-12 text-center">
          <div className="flex items-end gap-3">
            <Munchy mood="sleepy" className="h-36 w-32" label="Munchy napping next to an empty cart" />
            <Logo variant="icon" size={64} alt="" className="mb-2 rotate-6" />
          </div>
          <p className="font-display text-2xl font-extrabold text-espresso">Cart khaali hai…</p>
          <p className="text-ink/80">abhi bhook nahi lagi?</p>
          <ButtonLink to="/menu" size="md" className="mt-3" onClick={onClose}>
            Browse menu
          </ButtonLink>
        </div>
      ) : (
        <>
          <div data-lenis-prevent className="flex-1 space-y-4 overflow-y-auto overscroll-contain px-4 py-4">
            <FreeDeliveryBar />
            <ul className="space-y-3" aria-label="Cart items">
              <AnimatePresence initial={false} mode="popLayout">
                {items.map((item) => (
                  <CartLineItem
                    key={item.lineId}
                    item={item}
                    onQty={(qty) => (qty <= 0 ? remove(item) : updateQty(item.lineId, qty))}
                    onRemove={() => remove(item)}
                  />
                ))}
              </AnimatePresence>
            </ul>
            <CartUpsell />
          </div>
          <CartSummary />
        </>
      )}
    </>
  )
}
