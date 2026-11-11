import { describe, expect, it } from 'vitest'
import { COFFEE_DRINKS } from '@/data/coffeeBuilder'
import { getFeatured, getItemById, isPriced, menu } from '@/data/menu'
import { ROULETTE_ITEMS, VIBES } from '@/data/toys'
import { describeLine } from '@/lib/lineDescription'
import { priceLine, toCartInput } from '@/lib/itemOptions'
import { getUpsells } from '@/lib/recommendations'
import { buildLineId } from '@/store/cart'
import { pricedItem, toLine } from './fixtures'

const real = menu.filter((i) => !i.id.startsWith('test-'))

describe('menu data (owner list)', () => {
  it('unique slugs; prices are positive whole PKR or null ("Price coming soon")', () => {
    expect(new Set(real.map((i) => i.slug)).size).toBe(real.length)
    for (const i of real) expect(i.price === null || (Number.isInteger(i.price) && i.price > 0)).toBe(true)
  })

  it('every id referenced by toys, coffee maker and picks exists in the menu', () => {
    const ids = [...VIBES.flatMap((v) => v.picks), ...ROULETTE_ITEMS, ...COFFEE_DRINKS]
    for (const id of ids) expect(getItemById(id), id).toBeDefined()
    expect(getFeatured().length).toBeGreaterThan(0)
  })

  it('roulette + coffee maker only use items with a price (both end in "Add")', () => {
    for (const id of [...ROULETTE_ITEMS, ...COFFEE_DRINKS]) expect(isPriced(getItemById(id)!), id).toBe(true)
  })
})

describe('unpriced items', () => {
  it('a cart line for an item without a price is unavailable (never sent at a made-up price)', () => {
    const latte = pricedItem('spanish-latte')
    const line = toLine(toCartInput(latte))
    const unpriced = real.find((i) => !isPriced(i))!
    expect(priceLine({ ...line, itemId: unpriced.id, category: unpriced.category, options: {} })).toEqual({ available: false })
  })

  it('upsells never suggest an item without a price', () => {
    const burgerLine = { ...toLine(toCartInput(pricedItem('test-smash'))), category: 'burger' as const }
    for (const pick of getUpsells([burgerLine], 5)) expect(isPriced(pick)).toBe(true)
  })
})

describe('flavoured lattes: Hot / Cold / Blended', () => {
  it('same price for every temp; the line always states the temp (the barista needs it)', () => {
    const latte = pricedItem('spanish-latte')
    const hot = toCartInput(latte, { temp: 'hot', extras: [] })
    const blended = toCartInput(latte, { temp: 'blended', extras: [] })
    expect(hot.unitPrice).toBe(latte.price)
    expect(blended.unitPrice).toBe(latte.price)
    expect(describeLine(toLine(hot)).details).toEqual(['Hot'])
    expect(describeLine(toLine(blended)).details).toEqual(['Blended'])
    expect(buildLineId(hot.itemId, hot.options)).not.toBe(buildLineId(blended.itemId, blended.options))
    expect(priceLine(toLine(blended))).toEqual({ available: true, unitPrice: latte.price })
  })
})
