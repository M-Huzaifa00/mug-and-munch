import { formatPKR } from '@/lib/utils'
import { useCartSubtotal, useDeliveryFee } from '@/store/cart'
import { ButtonLink } from '@/components/ui/Button'
import { RollingNumber } from '@/components/ui/RollingNumber'

/** Subtotal / delivery / total + Checkout CTA (tax line is added on the checkout page). */
export function CartSummary() {
  const subtotal = useCartSubtotal()
  const deliveryFee = useDeliveryFee()

  return (
    <footer className="border-t-[2.5px] border-espresso bg-oat px-4 pt-3 pb-[calc(1rem+env(safe-area-inset-bottom))]">
      <dl className="space-y-1 text-sm text-ink">
        <div className="flex justify-between">
          <dt>Subtotal</dt>
          <dd className="font-semibold">
            <RollingNumber value={subtotal} format={formatPKR} />
          </dd>
        </div>
        <div className="flex justify-between">
          <dt>Delivery</dt>
          <dd className="font-semibold">{deliveryFee === 0 ? 'Free 🎉' : formatPKR(deliveryFee)}</dd>
        </div>
        <div className="flex justify-between pt-1 font-display text-xl font-extrabold text-espresso">
          <dt>Total</dt>
          <dd>
            <RollingNumber value={subtotal + deliveryFee} format={formatPKR} />
          </dd>
        </div>
      </dl>
      <ButtonLink to="/checkout" size="lg" className="mt-3 w-full">
        Checkout
      </ButtonLink>
      <p className="mt-2 text-center text-xs text-ink/70">Delivery fee only applies to delivery orders.</p>
    </footer>
  )
}
