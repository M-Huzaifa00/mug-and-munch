import { Trash2 } from 'lucide-react'
import { describeLine } from '@/lib/lineDescription'
import { notify } from '@/lib/notify'
import { formatPKR } from '@/lib/utils'
import { useCart, type CartItem } from '@/store/cart'
import { QuantityStepper } from '@/components/ui/QuantityStepper'
import { EditCreationLink } from '@/components/layout/cart/EditCreationLink'
import { LineTag } from '@/components/layout/cart/LineTag'

/** Review list: every line through describeLine, qty steppers synced to the store, remove, Edit/Tweak. */
export function OrderReview() {
  const items = useCart((s) => s.items)
  const updateQty = useCart((s) => s.updateQty)

  const remove = (item: CartItem) => {
    const { items: current, removeItem, restoreItem } = useCart.getState()
    const index = current.findIndex((i) => i.lineId === item.lineId)
    removeItem(item.lineId)
    notify('Removed from your order', { id: 'cart-remove', undo: () => restoreItem(item, index) })
  }

  return (
    <ul className="divide-y-2 divide-espresso/10" aria-label="Your order">
      {items.map((item) => {
        const d = describeLine(item)
        return (
          <li key={item.lineId} className="py-3 first:pt-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <LineTag kind={d.kind} tag={d.tag} className="mb-1" />
                <p className="font-display text-base leading-tight font-extrabold text-espresso">
                  <span aria-hidden="true">{d.emoji} </span>
                  {d.title}
                </p>
              </div>
              <p className="shrink-0 font-display font-extrabold text-espresso">{formatPKR(item.unitPrice * item.qty)}</p>
            </div>
            {d.details.length > 0 && (
              <ul className="mt-1.5 flex flex-wrap gap-1" aria-label={`${d.title} details`}>
                {d.details.map((t, i) => (
                  <li key={`${t}-${i}`} className="rounded-full bg-cheese/50 px-2 py-0.5 text-[0.6875rem] font-semibold text-espresso">
                    {t}
                  </li>
                ))}
              </ul>
            )}
            {item.unavailable ? (
              <div role="alert" className="mt-2 flex items-center justify-between gap-2 rounded-xl border-2 border-chili bg-chili/15 px-2 py-1 text-xs font-bold text-espresso">
                No longer available. Remove it to send your order.
                <button type="button" onClick={() => remove(item)} className="min-h-11 shrink-0 rounded-full px-3 underline decoration-2">
                  Remove
                </button>
              </div>
            ) : (
              <div className="mt-2 flex items-center gap-1">
                <QuantityStepper value={item.qty} onChange={(q) => (q <= 0 ? remove(item) : updateQty(item.lineId, q))} label={d.title} min={0} size="sm" />
                {d.edit && <EditCreationLink lineId={item.lineId} edit={d.edit} title={d.title} />}
                <button type="button" onClick={() => remove(item)} aria-label={`Remove ${d.title}`} className="ml-auto flex size-11 items-center justify-center rounded-full text-espresso/70 hover:bg-chili/15 hover:text-espresso">
                  <Trash2 size={18} aria-hidden="true" />
                </button>
              </div>
            )}
          </li>
        )
      })}
    </ul>
  )
}
