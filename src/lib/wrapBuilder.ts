import { SPICE_LABELS } from '@/data/menu'
import { WRAP_MAKER, type WrapChoice } from '@/data/wrapBuilder'
import type { AddItemInput } from '@/store/cart'
import { builderTotal, cleanName, type PricedPick } from './builder'

const M = WRAP_MAKER
const price = (list: readonly { id: string; price: number }[], id: string) => list.find((c) => c.id === id)?.price ?? 0
const label = (list: readonly { id: string; label: string }[], id: string) => list.find((c) => c.id === id)?.label ?? id

/** Fillings on the board: protein (2 if double) + cheeses + veggies + sauces. */
export const wrapFillingCount = (c: WrapChoice) => (c.double ? 2 : 1) + c.cheeses.length + c.veggies.length + c.sauces.length

export function wrapPrice(c: WrapChoice): number {
  const picks: PricedPick[] = [
    { price: price(M.bases, c.base) },
    { price: price(M.proteins, c.protein), qty: c.double ? 2 : 1 },
    ...c.cheeses.map((id) => ({ price: price(M.cheeses, id) })),
    ...c.veggies.map((id) => ({ price: price(M.veggies, id) })),
    ...c.sauces.map((id) => ({ price: price(M.sauces, id) })),
  ]
  return builderTotal(M.basePrice, picks)
}

/** Kitchen-order wording: base, protein (+double), cheese, veggies, sauces, spice. */
export function wrapLabels(c: WrapChoice): string[] {
  return [
    label(M.bases, c.base),
    `${label(M.proteins, c.protein)}${c.double ? ' ×2' : ''}`,
    ...c.cheeses.map((id) => label(M.cheeses, id)),
    ...c.veggies.map((id) => label(M.veggies, id)),
    ...c.sauces.map((id) => label(M.sauces, id)),
    SPICE_LABELS[c.spice],
  ]
}

export function wrapToCartInput(c: WrapChoice, name = ''): AddItemInput {
  const title = cleanName(name)
  return {
    itemId: 'custom-wrap',
    slug: 'build-your-wrap',
    name: title || M.fallbackName,
    image: M.image,
    emoji: '🌯',
    category: 'wrap',
    unitPrice: wrapPrice(c),
    options: { wrap: { ...c, cheeses: [...c.cheeses], veggies: [...c.veggies], sauces: [...c.sauces] }, name: title || undefined, spice: c.spice },
    optionLabels: wrapLabels(c),
    isCustom: true,
  }
}
