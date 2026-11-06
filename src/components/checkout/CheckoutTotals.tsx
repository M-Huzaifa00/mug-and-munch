import type { OrderTotals, OrderType } from '@/lib/orderTotals'
import { formatPKR } from '@/lib/utils'
import { RollingNumber } from '@/components/ui/RollingNumber'

/** Subtotal / delivery (or Free 🎉) / tax (only > 0) / total, in a polite live region. */
export function CheckoutTotals({ totals, orderType }: { totals: OrderTotals; orderType: OrderType }) {
  return (
    <dl className="space-y-1 text-sm text-ink" aria-live="polite" aria-atomic="true">
      <div className="flex justify-between">
        <dt>Subtotal</dt>
        <dd className="font-semibold">{formatPKR(totals.subtotal)}</dd>
      </div>
      {orderType === 'delivery' && (
        <div className="flex justify-between">
          <dt>Delivery</dt>
          <dd className="font-semibold">{totals.deliveryFee === 0 ? 'Free 🎉' : formatPKR(totals.deliveryFee)}</dd>
        </div>
      )}
      {totals.tax > 0 && (
        <div className="flex justify-between">
          <dt>Tax</dt>
          <dd className="font-semibold">{formatPKR(totals.tax)}</dd>
        </div>
      )}
      <div className="flex justify-between border-t-2 border-espresso/15 pt-2 font-display text-xl font-extrabold text-espresso">
        <dt>Total</dt>
        <dd>
          <RollingNumber value={totals.total} format={formatPKR} />
        </dd>
      </div>
    </dl>
  )
}
