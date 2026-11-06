import { BURGER_BUILDER, type BurgerIngredient, type BurgerLayerId } from '@/data/toys'
import type { AddItemInput } from '@/store/cart'

const byId = new Map<BurgerLayerId, BurgerIngredient>(BURGER_BUILDER.ingredients.map((i) => [i.id, i]))
export const ingredient = (id: BurgerLayerId) => byId.get(id)

export function burgerPrice(layers: BurgerLayerId[]): number {
  return layers.reduce<number>((sum, id) => sum + (byId.get(id)?.price ?? 0), BURGER_BUILDER.basePrice)
}

export const countOf = (layers: BurgerLayerId[], id: BurgerLayerId) => layers.filter((l) => l === id).length

/** "2× Smash patty", "Cheese", … (bun omitted: it's always included). */
export function burgerLabels(layers: BurgerLayerId[]): string[] {
  const order: BurgerLayerId[] = []
  for (const l of layers) if (l !== 'bun' && !order.includes(l)) order.push(l)
  return order.map((id) => {
    const n = countOf(layers, id)
    return `${n > 1 ? `${n}× ` : ''}${byId.get(id)?.label ?? id}`
  })
}

/** Custom cart line. Same fillings (any order) merge into one line via the option hash. */
export function burgerToCartInput(layers: BurgerLayerId[]): AddItemInput {
  const fillings = layers.filter((l) => l !== 'bun')
  return {
    itemId: 'custom-burger',
    slug: 'build-your-burger',
    name: 'Your Custom Smash',
    image: BURGER_BUILDER.image,
    emoji: '🍔',
    category: 'burger',
    unitPrice: burgerPrice(layers),
    options: { extras: fillings },
    optionLabels: burgerLabels(layers),
    isCustom: true,
  }
}
