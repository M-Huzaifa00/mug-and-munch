import { deals } from '@/data/deals'
import { getItemById } from '@/data/menu'
import type { WrapChoice } from '@/data/wrapBuilder'
import type { BurgerLayerId } from '@/data/builder'
import { burgerToCartInput } from '@/lib/burgerBuilder'
import { toCartInput } from '@/lib/itemOptions'
import { wrapToCartInput } from '@/lib/wrapBuilder'
import { buildLineId, type AddItemInput, type CartItem } from '@/store/cart'

export const toLine = (input: AddItemInput, qty = 1): CartItem => ({ ...input, lineId: buildLineId(input.itemId, input.options), qty })

const item = (id: string) => {
  const i = getItemById(id)
  if (!i) throw new Error(`fixture: missing menu item ${id}`)
  return i
}

export const smash = () => toCartInput(item('classic-smash'), { spice: 'desi-hot', extras: ['extra-cheese'] })

/** 10 layers, bottom → top. */
export const BIG_BURGER: BurgerLayerId[] = ['patty', 'cheese', 'patty', 'cheese', 'jalapeno', 'onion', 'lettuce', 'sauce', 'patty', 'sauce']
export const bigBurger = () => burgerToCartInput(BIG_BURGER, 'Midnight Monster')

export const makerCoffee = () =>
  toCartInput(item('spanish-latte'), { size: 'l', milk: 'oat', temp: 'iced', extras: ['hazelnut-syrup', 'extra-shot'], sweetness: 25 })

/** 8 fillings: protein ×2 + 2 cheeses + 2 veggies + 2 sauces. */
export const FULL_WRAP: WrapChoice = { base: 'paratha', protein: 'malai', double: true, cheeses: ['mozzarella', 'cheddar'], veggies: ['onion', 'pickled'], sauces: ['mint', 'imli'], spice: 'desi-hot' }
export const fullWrap = () => wrapToCartInput(FULL_WRAP, 'Late Night Lapet')

export const studentDeal = (): AddItemInput => {
  const d = deals[0]!
  return { itemId: d.id, slug: d.slug, name: d.name, image: '', emoji: d.emoji, category: 'deal', unitPrice: d.price, options: {}, optionLabels: [] }
}

export const fullCart = (): CartItem[] => [toLine(smash(), 2), toLine(bigBurger()), toLine(makerCoffee()), toLine(fullWrap()), toLine(studentDeal())]
