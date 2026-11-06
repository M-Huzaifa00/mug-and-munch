import { BURGER_BUILDER, type BurgerLayerId } from '@/data/toys'
import type { AddItemInput } from '@/store/cart'
import { builderLabels, builderPrice } from './builder'

const ING = BURGER_BUILDER.ingredients

export const burgerPrice = (layers: BurgerLayerId[]) => builderPrice(BURGER_BUILDER.basePrice, ING, layers)

/** Custom cart line. Same fillings (any order) merge into one line via the option hash. Bun is always included. */
export function burgerToCartInput(layers: BurgerLayerId[]): AddItemInput {
  return {
    itemId: 'custom-burger',
    slug: 'build-your-burger',
    name: 'Your Custom Smash',
    image: BURGER_BUILDER.image,
    emoji: '🍔',
    category: 'burger',
    unitPrice: burgerPrice(layers),
    options: { extras: layers.filter((l) => l !== 'bun') },
    optionLabels: builderLabels(ING, layers, ['bun']),
    isCustom: true,
  }
}
