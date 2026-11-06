import type { Order } from '@/lib/order'
import { formatPKR } from '@/lib/utils'
import { LineTag } from '@/components/layout/cart/LineTag'
import { CheckoutTotals } from './CheckoutTotals'

const TYPE_TEXT: Record<Order['orderType'], string> = { delivery: 'Delivery 🛵', takeaway: 'Takeaway 🥡', dineIn: 'Dine-in 🍽️' }

function detailText(order: Order): string {
  const d = order.details
  if (d.orderType === 'delivery') return [d.area, d.address, d.landmark].filter(Boolean).join(' · ')
  if (d.orderType === 'takeaway') return `Pickup: ${d.pickupTime}`
  return `Table ${d.table}`
}

/** Saved order (mm-last-order) rendered from its describeLine snapshot, so it reads like the WhatsApp message. */
export function OrderSnapshot({ order }: { order: Order }) {
  return (
    <div className="space-y-4 text-left">
      <p className="text-sm font-bold text-espresso">
        {TYPE_TEXT[order.orderType]} · {detailText(order)}
      </p>
      <ul className="divide-y-2 divide-espresso/10" aria-label="Order items">
        {order.lines.map((l) => (
          <li key={l.lineId} className="py-2">
            <div className="flex items-start justify-between gap-2">
              <p className="font-display font-extrabold text-espresso">
                {l.qty}× {l.description.title} <LineTag kind={l.description.kind} tag={l.description.tag} className="ml-1 align-middle" />
              </p>
              <p className="shrink-0 font-display font-extrabold text-espresso">{formatPKR(l.lineTotal)}</p>
            </div>
            {l.description.details.length > 0 && <p className="mt-0.5 text-sm text-ink/85">{l.description.details.join(' · ')}</p>}
          </li>
        ))}
      </ul>
      <CheckoutTotals totals={order.totals} orderType={order.orderType} />
      <p className="text-sm text-ink/85">
        {order.payment.label} · {order.customer.name} · {order.customer.phone}
        {order.customer.notes ? ` · “${order.customer.notes}”` : ''}
      </p>
    </div>
  )
}
