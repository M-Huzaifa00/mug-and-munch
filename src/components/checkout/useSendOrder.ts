import { useState } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { useTransitionNavigate } from '@/hooks/useTransitionNavigate'
import { checkoutSchema, type CheckoutForm, type CheckoutValues } from '@/lib/checkoutSchema'
import { track } from '@/lib/events'
import { buildOrder, saveLastOrder } from '@/lib/order'
import { createOrderNumber } from '@/lib/orderNumber'
import { getOrderTotals } from '@/lib/orderTotals'
import type { PickupPlan } from '@/lib/pickupSlots'
import { buildWhatsAppOrderMessage, getWhatsAppOrderUrl } from '@/lib/whatsapp'
import { useCart } from '@/store/cart'
import { FIELD_ID, FIELD_ORDER } from './fieldStyles'
import { rememberCustomer } from './useCheckoutForm'

export const SUCCESS_PATH = '/order-success?via=whatsapp'

/**
 * The WhatsApp CTA. Everything up to window.open is SYNCHRONOUS (no awaits) so popup blockers stay quiet:
 * validate → order number → snapshot (re-priced) → save mm-last-order (pending-send) → open wa.me
 * (fallback: same-tab) → track → wipe to /order-success. The cart is NOT cleared here.
 * Unconfigured number (dev only reaches this): show the message preview instead of opening wa.me.
 */
export function useSendOrder(form: UseFormReturn<CheckoutForm, unknown, CheckoutValues>, plan: PickupPlan) {
  const navigate = useTransitionNavigate()
  const [problems, setProblems] = useState<string[] | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  /** Focus the first invalid field in DOM order (or the summary when only cart problems remain). */
  const focusFirst = (bad: Set<string>) => {
    const first = FIELD_ORDER.find((n) => bad.has(n))
    if (first) document.getElementById(FIELD_ID[first])?.focus()
    else document.getElementById('co-errors')?.focus()
  }

  const send = () => {
    const cart = useCart.getState()
    cart.reprice()
    const items = useCart.getState().items
    const values = form.getValues()
    const parsed = checkoutSchema.safeParse(values)

    const extra: string[] = []
    if (items.length === 0) extra.push('Your cart is empty.')
    if (items.some((i) => i.unavailable)) extra.push('Remove the items that are no longer available.')
    const slotBad = values.orderType === 'takeaway' && !plan.slots.some((s) => s.value === values.pickupTime)
    if (getOrderTotals({ items, orderType: values.orderType }).belowMinimum) extra.push('This order is below the delivery minimum.')

    if (!parsed.success || extra.length || slotBad) {
      setProblems(extra)
      const bad = new Set(parsed.success ? [] : parsed.error.issues.map((i) => String(i.path[0])))
      if (slotBad) bad.add('pickupTime')
      // handleSubmit (not trigger) marks the form submitted → every field re-validates on change from now on.
      void form.handleSubmit(() => undefined, () => undefined)().then(() => {
        if (slotBad) form.setError('pickupTime', { message: 'Pick a pickup time' })
        // After React paints the error summary + aria-invalid states.
        window.setTimeout(() => focusFirst(bad), 30)
      })
      track('checkout_invalid', { fields: parsed.success ? '' : parsed.error.issues.map((i) => String(i.path[0])).join(',') })
      return
    }

    setProblems(null)
    const order = buildOrder(parsed.data, items, { number: createOrderNumber() })
    saveLastOrder(order)
    rememberCustomer(values)
    const url = getWhatsAppOrderUrl(order)
    if (!url) {
      setPreview(buildWhatsAppOrderMessage(order))
      return
    }

    const win = window.open(url, '_blank')
    if (win) win.opener = null
    track('whatsapp_order_click', { orderNumber: order.number, total: order.totals.total, orderType: order.orderType, customCount: order.lines.filter((l) => l.isCustom).length })
    if (win) navigate(SUCCESS_PATH)
    else {
      // Popup blocked → same tab. Success page first, so "back" from WhatsApp lands there.
      navigate(SUCCESS_PATH, { instant: true })
      window.setTimeout(() => window.location.assign(url), 60)
    }
  }

  return { send, problems, preview, closePreview: () => setPreview(null) }
}
