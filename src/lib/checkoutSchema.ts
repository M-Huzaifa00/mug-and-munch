import { z } from 'zod'
import { site } from '@/config/site'
import { normalizePkMobile } from '@/lib/phone'

export const PAYMENT_METHODS = ['cod', 'jazzcash', 'easypaisa', 'card'] as const
export type PaymentMethod = (typeof PAYMENT_METHODS)[number]

export const NOTES_MAX = 200
export const PHONE_ERROR = 'Enter a Pakistani mobile like 0300-1234567'

const base = z.object({
  name: z.string().trim().min(2, 'Tell us your name').max(40, 'Keep it under 40 characters'),
  phone: z.string().trim().refine((v) => normalizePkMobile(v) !== null, PHONE_ERROR),
  notes: z.string().trim().max(NOTES_MAX, `Notes can be up to ${NOTES_MAX} characters`),
  remember: z.boolean(),
  payment: z.enum(PAYMENT_METHODS).refine((m) => site.payments[m], 'Pay cash for now. Online payments are coming soon.'),
})

const delivery = base.extend({
  orderType: z.literal('delivery'),
  area: z.string().refine((a) => (site.deliveryAreas as readonly string[]).includes(a), 'Pick your area'),
  address: z.string().trim().min(5, 'Add your house / street address').max(160, 'Keep the address under 160 characters'),
  landmark: z.string().trim().max(80, 'Keep the landmark short'),
})

const takeaway = base.extend({
  orderType: z.literal('takeaway'),
  /** Human label: "ASAP" or "Today 9:30 PM" / "Tomorrow 12:30 PM". */
  pickupTime: z.string().min(1, 'Pick a pickup time'),
})

const dineIn = base.extend({
  orderType: z.literal('dineIn'),
  table: z.string().refine((t) => {
    const n = Number(t)
    return Number.isInteger(n) && n >= 1 && n <= site.tableCount
  }, `Pick a table (1–${site.tableCount})`),
})

export const checkoutSchema = z.discriminatedUnion('orderType', [delivery, takeaway, dineIn])
export type CheckoutValues = z.infer<typeof checkoutSchema>

/** Flat form shape (every field present) so switching order type keeps what was typed. */
export interface CheckoutForm {
  orderType: CheckoutValues['orderType']
  name: string
  phone: string
  notes: string
  remember: boolean
  payment: PaymentMethod
  area: string
  address: string
  landmark: string
  pickupTime: string
  table: string
}

export const EMPTY_CHECKOUT: CheckoutForm = {
  orderType: 'delivery',
  name: '',
  phone: '',
  notes: '',
  remember: false,
  payment: 'cod',
  area: '',
  address: '',
  landmark: '',
  pickupTime: 'ASAP',
  table: '',
}

/** Payment label shown to the customer + in the WhatsApp message. */
export function paymentLabel(method: PaymentMethod, orderType: CheckoutValues['orderType']): string {
  if (method === 'cod') return orderType === 'delivery' ? 'Cash on Delivery' : orderType === 'takeaway' ? 'Cash on pickup' : 'Pay at the counter'
  return { jazzcash: 'JazzCash', easypaisa: 'Easypaisa', card: 'Card' }[method]
}
