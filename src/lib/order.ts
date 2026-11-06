import { paymentLabel, type CheckoutValues, type PaymentMethod } from '@/lib/checkoutSchema'
import { priceLine } from '@/lib/itemOptions'
import { describeLine, type LineDescription } from '@/lib/lineDescription'
import { getOrderTotals, type OrderTotals, type OrderType } from '@/lib/orderTotals'
import { formatPkMobile, normalizePkMobile } from '@/lib/phone'
import type { CartItem, CartOptions } from '@/store/cart'

export type OrderStatus = 'pending-send' | 'sent'

export type OrderDetails =
  | { orderType: 'delivery'; area: string; address: string; landmark?: string }
  | { orderType: 'takeaway'; pickupTime: string }
  | { orderType: 'dineIn'; table: number }

export interface OrderLine {
  lineId: string
  itemId: string
  qty: number
  /** Re-priced from the current data files. */
  unitPrice: number
  lineTotal: number
  isCustom: boolean
  options: CartOptions
  /** Snapshot so the success page reads exactly like the message. */
  description: LineDescription
}

export interface Order {
  number: string
  /** ISO timestamp. */
  createdAt: string
  status: OrderStatus
  orderType: OrderType
  details: OrderDetails
  customer: { name: string; phone: string; notes?: string }
  payment: { method: PaymentMethod; label: string }
  lines: OrderLine[]
  totals: OrderTotals
}

function detailsFrom(v: CheckoutValues): OrderDetails {
  switch (v.orderType) {
    case 'delivery':
      return { orderType: 'delivery', area: v.area, address: v.address.trim(), landmark: v.landmark.trim() || undefined }
    case 'takeaway':
      return { orderType: 'takeaway', pickupTime: v.pickupTime }
    case 'dineIn':
      return { orderType: 'dineIn', table: Number(v.table) }
  }
}

/**
 * Snapshot an order from validated form values + the cart. Every line is re-priced and described now,
 * so the WhatsApp message and the success page never drift from what was sent.
 * Throws if a line is no longer available (checkout blocks that before calling this).
 */
export function buildOrder(values: CheckoutValues, items: readonly CartItem[], meta: { number: string; now?: Date }): Order {
  const lines: OrderLine[] = items.map((item) => {
    const priced = priceLine(item)
    if (!priced.available) throw new Error(`Line no longer available: ${item.name}`)
    return {
      lineId: item.lineId,
      itemId: item.itemId,
      qty: item.qty,
      unitPrice: priced.unitPrice,
      lineTotal: priced.unitPrice * item.qty,
      isCustom: Boolean(item.isCustom),
      options: item.options,
      description: describeLine(item),
    }
  })
  const notes = values.notes.trim()
  return {
    number: meta.number,
    createdAt: (meta.now ?? new Date()).toISOString(),
    status: 'pending-send',
    orderType: values.orderType,
    details: detailsFrom(values),
    customer: { name: values.name.trim(), phone: formatPkMobile(normalizePkMobile(values.phone) ?? values.phone), notes: notes || undefined },
    payment: { method: values.payment, label: paymentLabel(values.payment, values.orderType) },
    lines,
    totals: getOrderTotals({ items: lines, orderType: values.orderType }),
  }
}

/* ---------- mm-last-order (localStorage) ---------- */
export const LAST_ORDER_KEY = 'mm-last-order'

export function saveLastOrder(order: Order): void {
  try {
    localStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order))
  } catch {
    /* storage full / private mode: the success page falls back gracefully */
  }
}

export function loadLastOrder(): Order | null {
  try {
    const raw = localStorage.getItem(LAST_ORDER_KEY)
    if (!raw) return null
    const o = JSON.parse(raw) as Order
    return o && typeof o.number === 'string' && Array.isArray(o.lines) ? o : null
  } catch {
    return null
  }
}
