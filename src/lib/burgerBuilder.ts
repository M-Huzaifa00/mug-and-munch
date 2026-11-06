import { BURGER_BUILDER, type BurgerLayerId } from '@/data/builder'
import type { AddItemInput } from '@/store/cart'
import { builderLabels, builderTotal, cleanName } from './builder'

const ING = BURGER_BUILDER.ingredients
const priceOf = (id: string) => ING.find((i) => i.id === id)?.price ?? 0

export const burgerPrice = (layers: readonly BurgerLayerId[]) => builderTotal(BURGER_BUILDER.basePrice, layers.map((id) => ({ price: priceOf(id) })))

/**
 * Custom burger cart line. Layers are stored bottom → top (bun excluded) and are part of the
 * line hash, together with the name: identical creation + name merges, anything else is a new line.
 */
export function burgerToCartInput(layers: readonly BurgerLayerId[], name = ''): AddItemInput {
  const fillings = layers.filter((l) => l !== 'bun')
  const title = cleanName(name)
  return {
    itemId: 'custom-burger',
    slug: 'build-your-burger',
    name: title || BURGER_BUILDER.fallbackName,
    image: BURGER_BUILDER.image,
    emoji: '🍔',
    category: 'burger',
    unitPrice: burgerPrice(layers),
    options: { layers: fillings, name: title || undefined },
    optionLabels: builderLabels(ING, fillings),
    isCustom: true,
  }
}
