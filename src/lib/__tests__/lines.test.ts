import { afterEach, describe, expect, it } from 'vitest'
import { BURGER_BUILDER } from '@/data/builder'
import { describeLine } from '@/lib/lineDescription'
import { priceLine, repriceLines, toCartInput } from '@/lib/itemOptions'
import { burgerToCartInput } from '@/lib/burgerBuilder'
import { wrapToCartInput } from '@/lib/wrapBuilder'
import { buildLineId } from '@/store/cart'
import { bigBurger, FULL_WRAP, fullWrap, makerCoffee, pricedItem, smash, studentDeal, toLine } from './fixtures'

describe('describeLine', () => {
  it('custom burger: quoted name, bun first, grouped layers bottom → top, sauces last', () => {
    const d = describeLine(toLine(bigBurger()))
    expect(d.title).toBe('"Midnight Monster"')
    expect(d.tag).toBe('Custom burger 🍔')
    expect(d.details).toEqual(['Sesame bun', 'Smash patty ×3', 'Cheese ×2', 'Jalapeños', 'Onion', 'Lettuce', 'House sauce ×2'])
    expect(d.edit).toEqual({ tab: 'burger', label: 'Edit' })
  })

  it('custom burger without a name falls back to "Custom Burger"', () => {
    expect(describeLine(toLine(burgerToCartInput(['patty']))).title).toBe('Custom Burger')
  })

  it('custom wrap: base, protein (+double), cheese, veggies, sauces, spice', () => {
    const d = describeLine(toLine(fullWrap()))
    expect(d.title).toBe('"Late Night Lapet"')
    expect(d.tag).toBe('Custom wrap 🌯')
    expect(d.details).toEqual(['Paratha', 'Malai boti ×2', 'Mozzarella', 'Cheddar', 'Onions', 'Pickled onions', 'Mint chutney', 'Imli', 'Desi Hot 🌶️'])
  })

  it('coffee: size, milk, temp, add-ons in menu order, sweetness when not default', () => {
    const d = describeLine(toLine(makerCoffee()))
    expect(d.title).toBe('Test Latte')
    expect(d.tag).toBeUndefined()
    expect(d.details).toEqual(['Large', 'Oat milk', 'Iced', 'Extra shot', 'Hazelnut syrup', 'Sweetness 25%'])
    expect(d.edit?.label).toBe('Tweak')
  })

  it('coffee at default sweetness hides it', () => {
    const latte = pricedItem('test-latte')
    expect(describeLine(toLine(toCartInput(latte))).details).not.toContain('Sweetness 50%')
  })

  it('maker coffee and the same menu coffee are identical (same text, same line → merge)', () => {
    const latte = pricedItem('test-latte')
    const fromMenu = toCartInput(latte, { size: 'l', temp: 'iced', milk: 'oat', extras: ['extra-shot', 'hazelnut-syrup'], sweetness: 25 })
    const fromMaker = makerCoffee()
    expect(describeLine(toLine(fromMenu))).toEqual(describeLine(toLine(fromMaker)))
    expect(buildLineId(fromMenu.itemId, fromMenu.options)).toBe(buildLineId(fromMaker.itemId, fromMaker.options))
    expect(fromMenu.unitPrice).toBe(fromMaker.unitPrice)
  })

  it('normal item: spice + extras', () => {
    const d = describeLine(toLine(smash()))
    expect(d.kind).toBe('item')
    expect(d.details).toEqual(['Desi Hot 🌶️', '+Extra cheese'])
  })

  it('deal: tag "Deal", details = what is inside', () => {
    const d = describeLine(toLine(studentDeal()))
    expect(d.tag).toBe('Deal')
    expect(d.details).toEqual(['Test Smash', 'Tea / Chai'])
  })
})

describe('priceLine', () => {
  const original = BURGER_BUILDER.ingredients[0]!.price
  afterEach(() => {
    ;(BURGER_BUILDER.ingredients[0] as { price: number }).price = original
  })

  it('matches the price at add time', () => {
    for (const input of [smash(), bigBurger(), makerCoffee(), fullWrap(), studentDeal()]) {
      expect(priceLine(toLine(input))).toEqual({ available: true, unitPrice: input.unitPrice })
    }
  })

  it('re-prices after a builder price change', () => {
    const line = toLine(burgerToCartInput(['patty', 'patty']))
    ;(BURGER_BUILDER.ingredients[0] as { price: number }).price = 500
    expect(priceLine(line)).toEqual({ available: true, unitPrice: 350 + 1000 })
    const { items, priceChanged } = repriceLines([line])
    expect(priceChanged).toBe(true)
    expect(items[0]!.unitPrice).toBe(1350)
  })

  it('removed ingredient / item / option → unavailable', () => {
    const burger = toLine(burgerToCartInput(['patty']))
    expect(priceLine({ ...burger, options: { layers: ['patty', 'bacon'] } })).toEqual({ available: false })
    expect(priceLine({ ...toLine(fullWrap()), options: { wrap: { ...FULL_WRAP, sauces: ['ketchup' as 'mint'] } } })).toEqual({ available: false })
    expect(priceLine({ ...toLine(smash()), itemId: 'gone-burger' })).toEqual({ available: false })
    expect(priceLine({ ...toLine(makerCoffee()), options: { ...makerCoffee().options, milk: 'soy' } })).toEqual({ available: false })
    expect(priceLine({ ...toLine(studentDeal()), itemId: 'old-deal' })).toEqual({ available: false })
    const { items, changed, priceChanged } = repriceLines([{ ...burger, options: { layers: ['bacon'] } }])
    expect(items[0]!.unavailable).toBe(true)
    expect(changed).toBe(true)
    expect(priceChanged).toBe(false)
  })
})

describe('merge rules', () => {
  const id = (i: { itemId: string; options: Parameters<typeof buildLineId>[1] }) => buildLineId(i.itemId, i.options)

  it('identical creation + name merges', () => {
    expect(id(burgerToCartInput(['patty', 'cheese'], 'Stack'))).toBe(id(burgerToCartInput(['patty', 'cheese'], ' stack ')))
    expect(id(wrapToCartInput(FULL_WRAP, 'Roll'))).toBe(id(wrapToCartInput({ ...FULL_WRAP, sauces: ['imli', 'mint'] }, 'Roll')))
  })

  it('any difference creates a new line', () => {
    const a = id(burgerToCartInput(['patty', 'cheese'], 'Stack'))
    expect(id(burgerToCartInput(['cheese', 'patty'], 'Stack'))).not.toBe(a) // layer order matters
    expect(id(burgerToCartInput(['patty', 'cheese'], 'Other'))).not.toBe(a)
    expect(id(burgerToCartInput(['patty', 'cheese', 'cheese'], 'Stack'))).not.toBe(a)
    expect(id(wrapToCartInput({ ...FULL_WRAP, double: false }, 'Roll'))).not.toBe(id(wrapToCartInput(FULL_WRAP, 'Roll')))
  })
})
