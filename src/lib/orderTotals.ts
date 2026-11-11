import { site } from '@/config/site'

export type OrderType = 'delivery' | 'takeaway' | 'dineIn'

export const ORDER_TYPES: readonly OrderType[] = ['delivery', 'takeaway', 'dineIn']

/** Minimal line shape needed for money maths (cart lines and order snapshots both fit). */
export interface PricedLine {
  unitPrice: number
  qty: number
  /** Set by re-pricing when the item / option no longer exists (or lost its price): never counted. */
  unavailable?: boolean
}

export interface OrderTotals {
  subtotal: number
  /** Delivery only; 0 for takeaway / dine-in and at or above the free-delivery threshold. */
  deliveryFee: number
  /** subtotal × site.commerce.taxRate (0 while the owner hasn't set a rate). */
  tax: number
  total: number
  /** Rs still needed for free delivery (0 when unlocked or not a delivery order). */
  amountToFreeDelivery: number
  /** Delivery subtotal below site.commerce.minDeliveryOrder. */
  belowMinimum: boolean
}

interface TotalsConfig {
  freeDeliveryThreshold: number
  deliveryFee: number
  taxRate: number
  minDeliveryOrder: number
}

/** The single source of truth for money (drawer, checkout, WhatsApp message, success page). */
export function getOrderTotals(
  { items, orderType }: { items: readonly PricedLine[]; orderType: OrderType },
  config: TotalsConfig = site.commerce,
): OrderTotals {
  const subtotal = Math.round(items.reduce((sum, i) => (i.unavailable ? sum : sum + i.unitPrice * i.qty), 0))
  const isDelivery = orderType === 'delivery'
  const freeUnlocked = subtotal >= config.freeDeliveryThreshold
  const deliveryFee = isDelivery && subtotal > 0 && !freeUnlocked ? config.deliveryFee : 0
  // TODO: owner confirms GST / ICT sales tax rate in site.ts (commerce.taxRate). Rounded once, here.
  const tax = Math.round(subtotal * config.taxRate)
  return {
    subtotal,
    deliveryFee,
    tax,
    total: subtotal + deliveryFee + tax,
    amountToFreeDelivery: isDelivery ? Math.max(0, config.freeDeliveryThreshold - subtotal) : 0,
    belowMinimum: isDelivery && subtotal > 0 && subtotal < config.minDeliveryOrder,
  }
}
