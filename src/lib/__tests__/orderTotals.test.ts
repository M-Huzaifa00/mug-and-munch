import { describe, expect, it } from 'vitest'
import { site } from '@/config/site'
import { getOrderTotals } from '@/lib/orderTotals'
import { burgerToCartInput } from '@/lib/burgerBuilder'
import { wrapToCartInput } from '@/lib/wrapBuilder'
import { WRAP_DEFAULTS } from '@/data/wrapBuilder'

const cfg = { freeDeliveryThreshold: 2500, deliveryFee: 199, taxRate: 0, minDeliveryOrder: 0 }
const line = (unitPrice: number, qty = 1) => ({ unitPrice, qty })

describe('getOrderTotals', () => {
  it('charges delivery below the threshold', () => {
    const t = getOrderTotals({ items: [line(2499)], orderType: 'delivery' }, cfg)
    expect(t).toMatchObject({ subtotal: 2499, deliveryFee: 199, tax: 0, total: 2698, amountToFreeDelivery: 1 })
  })

  it('is free exactly at the threshold', () => {
    const t = getOrderTotals({ items: [line(1250, 2)], orderType: 'delivery' }, cfg)
    expect(t).toMatchObject({ subtotal: 2500, deliveryFee: 0, total: 2500, amountToFreeDelivery: 0 })
  })

  it.each(['takeaway', 'dineIn'] as const)('%s never pays delivery', (orderType) => {
    const t = getOrderTotals({ items: [line(500)], orderType }, cfg)
    expect(t).toMatchObject({ deliveryFee: 0, total: 500, amountToFreeDelivery: 0, belowMinimum: false })
  })

  it('empty cart → zeros', () => {
    expect(getOrderTotals({ items: [], orderType: 'delivery' }, cfg)).toMatchObject({ subtotal: 0, deliveryFee: 0, total: 0 })
  })

  it('applies tax once, rounded to whole rupees', () => {
    const t = getOrderTotals({ items: [line(999)], orderType: 'takeaway' }, { ...cfg, taxRate: 0.16 })
    expect(t.tax).toBe(160) // 159.84 → 160
    expect(t.total).toBe(1159)
  })

  it('tax + delivery together', () => {
    const t = getOrderTotals({ items: [line(1000)], orderType: 'delivery' }, { ...cfg, taxRate: 0.05 })
    expect(t).toMatchObject({ subtotal: 1000, deliveryFee: 199, tax: 50, total: 1249 })
  })

  it('flags delivery orders below the minimum only', () => {
    const c = { ...cfg, minDeliveryOrder: 800 }
    expect(getOrderTotals({ items: [line(700)], orderType: 'delivery' }, c).belowMinimum).toBe(true)
    expect(getOrderTotals({ items: [line(800)], orderType: 'delivery' }, c).belowMinimum).toBe(false)
    expect(getOrderTotals({ items: [line(700)], orderType: 'takeaway' }, c).belowMinimum).toBe(false)
  })

  it('handles custom + deal lines like any other line', () => {
    const burger = { ...burgerToCartInput(['patty', 'cheese']), qty: 2 }
    const wrap = { ...wrapToCartInput(WRAP_DEFAULTS), qty: 1 }
    const deal = { unitPrice: 1199, qty: 1 }
    const t = getOrderTotals({ items: [burger, wrap, deal], orderType: 'delivery' }, cfg)
    expect(t.subtotal).toBe((350 + 450 + 150) * 2 + (250 + 450) + 1199)
    expect(t.deliveryFee).toBe(0)
  })

  it('defaults to site.commerce', () => {
    const t = getOrderTotals({ items: [line(100)], orderType: 'delivery' })
    expect(t.deliveryFee).toBe(site.commerce.deliveryFee)
  })
})
