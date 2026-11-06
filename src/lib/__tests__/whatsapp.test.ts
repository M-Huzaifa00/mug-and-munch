import { describe, expect, it } from 'vitest'
import { site } from '@/config/site'
import { EMPTY_CHECKOUT, checkoutSchema, type CheckoutForm } from '@/lib/checkoutSchema'
import { buildOrder } from '@/lib/order'
import { createOrderNumber } from '@/lib/orderNumber'
import { buildWhatsAppOrderMessage, getWhatsAppOrderUrl, isWhatsappConfigured, WA_MESSAGE_LIMIT } from '@/lib/whatsapp'
import { BIG_BURGER, fullCart } from './fixtures'

describe('isWhatsappConfigured', () => {
  it('rejects the shipped placeholder', () => {
    expect(isWhatsappConfigured('923000000000')).toBe(false)
    expect(isWhatsappConfigured(site.contact.whatsappNumber)).toBe(isWhatsappConfigured())
  })
  it('rejects invalid numbers', () => {
    expect(isWhatsappConfigured('')).toBe(false)
    expect(isWhatsappConfigured('92511234567')).toBe(false)
    expect(isWhatsappConfigured('12345')).toBe(false)
  })
  it('accepts a real-looking PK mobile in any common format', () => {
    expect(isWhatsappConfigured('923331234567')).toBe(true)
    expect(isWhatsappConfigured('+92 333 1234567')).toBe(true)
    expect(isWhatsappConfigured('0333-1234567')).toBe(true)
  })
})

describe('createOrderNumber', () => {
  it('MM-YYMMDD-XXXX in Asia/Karachi', () => {
    // 2026-11-06 20:30 UTC = 2026-11-07 01:30 in Karachi (UTC+5)
    const n = createOrderNumber(new Date('2026-11-06T20:30:00Z'), () => 0.5)
    expect(n).toBe(`${site.orderPrefix}-261107-IIII`)
    expect(createOrderNumber()).toMatch(new RegExp(`^${site.orderPrefix}-\\d{6}-[0-9A-Z]{4}$`))
  })
})

const FORMS: Record<string, Partial<CheckoutForm>> = {
  delivery: { orderType: 'delivery', area: 'F-7', address: 'House 12, Street 34', landmark: 'Near the park' },
  takeaway: { orderType: 'takeaway', pickupTime: 'Today 9:30 PM' },
  dineIn: { orderType: 'dineIn', table: '7' },
}

describe('buildWhatsAppOrderMessage', () => {
  it.each(Object.keys(FORMS))('%s: full message with every layer + filling, under 2,000 chars', (type) => {
    const values = checkoutSchema.parse({ ...EMPTY_CHECKOUT, name: 'Ali', phone: '+92 300 1234567', notes: 'Extra napkins pls', ...FORMS[type] })
    const order = buildOrder(values, fullCart(), { number: 'MM-261107-TEST', now: new Date('2026-11-07T10:00:00Z') })
    const msg = buildWhatsAppOrderMessage(order)

    expect(msg).toMatchSnapshot()
    expect(msg.length).toBeLessThan(WA_MESSAGE_LIMIT)
    expect(msg).toContain(`🧾 *New order MM-261107-TEST* · ${site.brandName}`)
    expect(msg).toContain('Phone: 0300-1234567')
    // Kitchen needs everything: every burger layer + wrap filling.
    for (const part of ['Smash patty ×3', 'Cheese ×2', 'Jalapeños', 'Onion', 'Lettuce', 'House sauce ×2']) expect(msg).toContain(part)
    expect(BIG_BURGER).toHaveLength(10)
    for (const part of ['Paratha', 'Malai boti ×2', 'Mozzarella', 'Cheddar', 'Onions', 'Pickled onions', 'Mint chutney', 'Imli']) expect(msg).toContain(part)
    expect(msg).toContain(`*Total: Rs ${order.totals.total.toLocaleString('en-PK')}*`)
    if (type !== 'delivery') expect(msg).not.toContain('Delivery:')
  })

  it('never drops items when the cart is huge (shortens wording only)', () => {
    const values = checkoutSchema.parse({ ...EMPTY_CHECKOUT, name: 'Ali', phone: '03001234567', ...FORMS.delivery })
    const many = Array.from({ length: 3 }, () => fullCart()).flat().map((l, i) => ({ ...l, lineId: `${l.lineId}-${i}` }))
    const order = buildOrder(values, many, { number: 'MM-261107-BIG1' })
    const msg = buildWhatsAppOrderMessage(order)
    expect(msg.split('\n').filter((l) => /^\d+× /.test(l))).toHaveLength(many.length)
    expect(msg.match(/Pickled onions/g)).toHaveLength(3)
  })

  it('wa.me URL uses the configured digits only, never a placeholder', () => {
    const values = checkoutSchema.parse({ ...EMPTY_CHECKOUT, name: 'Ali', phone: '03001234567', ...FORMS.takeaway })
    const order = buildOrder(values, fullCart(), { number: 'MM-261107-URL1' })
    expect(getWhatsAppOrderUrl(order, null)).toBeNull()
    const url = getWhatsAppOrderUrl(order, '923331234567')!
    expect(url.startsWith('https://wa.me/923331234567?text=')).toBe(true)
    expect(decodeURIComponent(url.split('?text=')[1]!)).toBe(buildWhatsAppOrderMessage(order))
  })
})

describe('checkoutSchema', () => {
  it('requires the fields of the chosen order type only', () => {
    const base = { ...EMPTY_CHECKOUT, name: 'Ali', phone: '0300-1234567' }
    expect(checkoutSchema.safeParse({ ...base, orderType: 'delivery' }).success).toBe(false)
    expect(checkoutSchema.safeParse({ ...base, orderType: 'takeaway' }).success).toBe(true)
    expect(checkoutSchema.safeParse({ ...base, orderType: 'dineIn', table: '0' }).success).toBe(false)
    expect(checkoutSchema.safeParse({ ...base, orderType: 'dineIn', table: String(site.tableCount) }).success).toBe(true)
  })
  it('rejects bad phones + disabled payments', () => {
    const ok = { ...EMPTY_CHECKOUT, name: 'Ali', orderType: 'takeaway' as const }
    expect(checkoutSchema.safeParse({ ...ok, phone: '0400-1234567' }).success).toBe(false)
    expect(checkoutSchema.safeParse({ ...ok, phone: '0300-1234567', payment: 'card' }).success).toBe(site.payments.card)
  })
})
