import { SPICE_LABELS, type ItemOptions, type MenuItem, type OptionChoice, type SpiceLevel } from '@/data/menu'
import type { AddItemInput, CartOptions } from '@/store/cart'

/** The shopper's current choices for one menu item. */
export interface OptionSelection {
  size?: string
  temp?: string
  milk?: string
  spice?: SpiceLevel
  extras: string[]
}

export type SingleGroup = 'sizes' | 'temps' | 'milks'
const SELECTION_KEY: Record<SingleGroup, 'size' | 'temp' | 'milk'> = { sizes: 'size', temps: 'temp', milks: 'milk' }

/** Sensible defaults: first choice of every group, "Medium" spice. */
export function defaultSelection(item: MenuItem): OptionSelection {
  const o = item.options
  return {
    size: o.sizes?.[0]?.id,
    temp: o.temps?.[0]?.id,
    milk: o.milks?.[0]?.id,
    spice: item.spiceLevels?.includes('medium') ? 'medium' : item.spiceLevels?.[0],
    extras: [],
  }
}

/**
 * Items where a choice changes the price meaningfully (size) open the item modal on quick-add.
 * Everything else (spice defaults to Medium) adds instantly for less friction.
 */
export function hasRequiredOptions(item: MenuItem): boolean {
  return (item.options.sizes?.length ?? 0) > 1
}

const find = (choices: OptionChoice[] | undefined, id: string | undefined) => choices?.find((c) => c.id === id)

export function unitPriceFor(item: MenuItem, sel: OptionSelection): number {
  const o: ItemOptions = item.options
  let price = item.price
  for (const group of Object.keys(SELECTION_KEY) as SingleGroup[]) {
    price += find(o[group], sel[SELECTION_KEY[group]])?.priceDelta ?? 0
  }
  for (const id of sel.extras) price += find(o.extras, id)?.priceDelta ?? 0
  return price
}

/** Short chips for the cart line, e.g. ["Large", "Iced", "Oat milk", "Desi Hot 🌶️", "+ Extra shot"]. */
export function optionLabels(item: MenuItem, sel: OptionSelection): string[] {
  const o = item.options
  const labels: string[] = []
  const size = find(o.sizes, sel.size)
  if (size) labels.push(size.label)
  const temp = find(o.temps, sel.temp)
  if (temp && o.temps && temp.id !== o.temps[0]?.id) labels.push(temp.label)
  const milk = find(o.milks, sel.milk)
  if (milk && o.milks && milk.id !== o.milks[0]?.id) labels.push(milk.label)
  if (sel.spice) labels.push(SPICE_LABELS[sel.spice])
  for (const id of sel.extras) {
    const extra = find(o.extras, id)
    if (extra) labels.push(`+ ${extra.label}`)
  }
  return labels
}

/** Turn a menu item + selection into a cart line input. */
export function toCartInput(item: MenuItem, sel: OptionSelection = defaultSelection(item)): AddItemInput {
  const options: CartOptions = { size: sel.size, temp: sel.temp, milk: sel.milk, spice: sel.spice, extras: sel.extras }
  return {
    itemId: item.id,
    slug: item.slug,
    name: item.name,
    image: item.image,
    emoji: item.emoji,
    category: item.category,
    unitPrice: unitPriceFor(item, sel),
    options,
    optionLabels: optionLabels(item, sel),
  }
}
