import { useMemo, useState } from 'react'
import { RotateCcw } from 'lucide-react'
import { getItemById, isPriced } from '@/data/menu'
import { priceLine, selectionFromOptions, toCartInput } from '@/lib/itemOptions'
import { notify } from '@/lib/notify'
import { loadLastOrder, type Order } from '@/lib/order'
import { formatPKR } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { useCart, type AddItemInput } from '@/store/cart'

interface AgainLine {
  input: AddItemInput
  qty: number
}

/** Last order's lines that are STILL orderable, re-priced from today's menu (custom / removed / unpriced lines dropped). */
function againLines(order: Order | null): AgainLine[] {
  if (!order) return []
  return order.lines.flatMap((l) => {
    if (l.isCustom) return []
    const item = getItemById(l.itemId)
    if (!item || !isPriced(item)) return []
    const input = toCartInput(item, selectionFromOptions(l.options))
    const p = priceLine(input)
    return p.available ? [{ input: { ...input, unitPrice: p.unitPrice }, qty: l.qty }] : []
  })
}

/**
 * Returning visitors only (an order saved on this phone by checkout, `mm-last-order`): one tap puts the same
 * order back in the cart at TODAY's prices and opens the drawer. Renders nothing for first-time visitors.
 */
export function OrderAgain() {
  const [order] = useState(loadLastOrder)
  const lines = useMemo(() => againLines(order), [order])
  if (!lines.length) return null

  const total = lines.reduce((s, l) => s + l.input.unitPrice * l.qty, 0)
  const summary = lines
    .slice(0, 2)
    .map((l) => `${l.qty}× ${l.input.name}`)
    .join(', ')
  const more = lines.length > 2 ? ` +${lines.length - 2} more` : ''

  const reorder = () => {
    const { addItem, openCart } = useCart.getState()
    for (const l of lines) addItem(l.input, l.qty)
    if ('vibrate' in navigator) navigator.vibrate(12)
    openCart()
    notify('Your usual is in the cart 🛒', { id: 'cart-add' })
  }

  return (
    <div data-hn-fade className="mt-6 flex max-w-xl flex-wrap items-center gap-x-4 gap-y-2 rounded-3xl border-2 border-espresso/15 bg-oat/80 px-4 py-3">
      <p className="min-w-0 flex-1 text-sm text-ink">
        <span className="font-hand text-xl text-espresso">Welcome back!</span>{' '}
        <span className="font-semibold">
          Last time: {summary}
          {more}
        </span>{' '}
        <span className="text-ink/70">· {formatPKR(total)} today</span>
      </p>
      <Button size="sm" onClick={reorder} className="shrink-0">
        <RotateCcw size={16} strokeWidth={2.8} aria-hidden="true" /> Order again
      </Button>
    </div>
  )
}
