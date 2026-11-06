import { formatPKR } from '@/lib/utils'
import { useOrderTotals, useOrderType } from '@/store/cart'
import { ButtonLink } from '@/components/ui/Button'
import { RollingNumber } from '@/components/ui/RollingNumber'

const TYPE_LABEL = { delivery: 'Delivery', takeaway: 'Takeaway', dineIn: 'Dine-in' } as const

/** Subtotal / delivery (delivery orders only) / tax (rate > 0 only) / total + Checkout CTA. */
export function CartSummary({ blocked = false }: { blocked?: boolean }) {
  const totals = useOrderTotals()
  const orderType = useOrderType()

  return (
    <footer className="border-t-[2.5px] border-espresso bg-oat px-4 pt-3 pb-[calc(1rem+env(safe-area-inset-bottom))]">
      <dl className="space-y-1 text-sm text-ink" aria-live="polite">
        <div className="flex justify-between">
          <dt>Subtotal</dt>
          <dd className="font-semibold">
            <RollingNumber value={totals.subtotal} format={formatPKR} />
          </dd>
        </div>
        {orderType === 'delivery' ? (
          <div className="flex justify-between">
            <dt>Delivery</dt>
            <dd className="font-semibold">{totals.deliveryFee === 0 ? 'Free 🎉' : formatPKR(totals.deliveryFee)}</dd>
          </div>
        ) : (
          <div className="flex justify-between">
            <dt>{TYPE_LABEL[orderType]}</dt>
            <dd className="font-semibold">No delivery fee</dd>
          </div>
        )}
        {totals.tax > 0 && (
          <div className="flex justify-between">
            <dt>Tax</dt>
            <dd className="font-semibold">{formatPKR(totals.tax)}</dd>
          </div>
        )}
        <div className="flex justify-between pt-1 font-display text-xl font-extrabold text-espresso">
          <dt>Total</dt>
          <dd>
            <RollingNumber value={totals.total} format={formatPKR} />
          </dd>
        </div>
      </dl>
      <ButtonLink to="/checkout" size="lg" className="mt-3 w-full" aria-disabled={blocked || undefined}>
        Checkout
      </ButtonLink>
      <p className="mt-2 text-center text-xs text-ink/70">
        {orderType === 'delivery' ? 'Takeaway or dine-in? No delivery fee. Pick it at checkout.' : `${TYPE_LABEL[orderType]} order · change it at checkout.`}
      </p>
    </footer>
  )
}
