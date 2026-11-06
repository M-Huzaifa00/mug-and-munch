import { describe, expect, it } from 'vitest'
import { builderTotal, canAdd, cleanName, hasRoom, pickFunName } from '@/lib/builder'
import { burgerPrice, burgerToCartInput } from '@/lib/burgerBuilder'
import { wrapFillingCount, wrapPrice } from '@/lib/wrapBuilder'
import { BURGER_BUILDER } from '@/data/builder'
import { WRAP_DEFAULTS, WRAP_MAKER } from '@/data/wrapBuilder'

describe('builder pricing', () => {
  it('base + Σ price × qty', () => {
    expect(builderTotal(100, [])).toBe(100)
    expect(builderTotal(100, [{ price: 50 }, { price: 20, qty: 3 }])).toBe(210)
  })

  it('burger = base + layers (bun free)', () => {
    expect(burgerPrice([])).toBe(BURGER_BUILDER.basePrice)
    expect(burgerPrice(['patty', 'patty', 'cheese', 'bun'])).toBe(350 + 450 * 2 + 150)
  })

  it('wrap = base + base upgrade + protein (×2 when double) + fillings', () => {
    expect(wrapPrice(WRAP_DEFAULTS)).toBe(WRAP_MAKER.basePrice + 450)
    const c = { ...WRAP_DEFAULTS, base: 'paratha' as const, protein: 'malai' as const, double: true, cheeses: ['mozzarella' as const], veggies: ['onion' as const], sauces: ['mint' as const, 'imli' as const] }
    expect(wrapPrice(c)).toBe(250 + 80 + 450 * 2 + 150 + 40 + 40 + 40)
    expect(wrapFillingCount(c)).toBe(6)
  })
})

describe('guards + names', () => {
  it('max-items guard', () => {
    expect(hasRoom(9, 10)).toBe(true)
    expect(hasRoom(10, 10)).toBe(false)
    const ing = BURGER_BUILDER.ingredients
    expect(canAdd(ing, ['patty', 'patty', 'patty'], 'patty', 10)).toBe(false)
    expect(canAdd(ing, ['patty'], 'patty', 10)).toBe(true)
  })

  it('fun name differs from the current one', () => {
    for (let i = 0; i < 20; i++) expect(pickFunName(['A', 'B'], 'A')).toBe('B')
  })

  it('cleans names (trim, collapse, 30 chars) and falls back', () => {
    expect(cleanName('  The   F-7  Special ')).toBe('The F-7 Special')
    expect(cleanName('x'.repeat(40))).toHaveLength(30)
    expect(burgerToCartInput(['patty'], '   ').name).toBe('Custom Burger')
  })
})
