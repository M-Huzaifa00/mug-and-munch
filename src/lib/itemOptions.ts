import { site } from '@/config/site'
import { BURGER_BUILDER, type BurgerLayerId } from '@/data/builder'
import { deals } from '@/data/deals'
import { getItemById, isPriced, SPICE_LABELS, SWEETNESS_DEFAULT, type ItemOptions, type MenuItem, type OptionChoice, type PricedItem, type SpiceLevel } from '@/data/menu'
import { WRAP_MAKER } from '@/data/wrapBuilder'
import { burgerPrice } from '@/lib/burgerBuilder'
import { wrapPrice } from '@/lib/wrapBuilder'
import type { AddItemInput, CartItem, CartOptions } from '@/store/cart'

/** The shopper's current choices for one menu item. */
export interface OptionSelection {
  size?: string
  temp?: string
  milk?: string
  spice?: SpiceLevel
  extras: string[]
  /** Coffee sweetness % (only for items with options.sweetness). */
  sweetness?: number
}

export type SingleGroup = 'sizes' | 'temps' | 'milks'
const SELECTION_KEY: Record<SingleGroup, 'size' | 'temp' | 'milk'> = { sizes: 'size', temps: 'temp', milks: 'milk' }

/** Sensible defaults: first choice of every group, "Medium" spice, 50% sweetness. */
export function defaultSelection(item: MenuItem): OptionSelection {
  const o = item.options
  return {
    size: o.sizes?.[0]?.id,
    temp: o.temps?.[0]?.id,
    milk: o.milks?.[0]?.id,
    spice: item.spiceLevels?.includes('medium') ? 'medium' : item.spiceLevels?.[0],
    extras: [],
    sweetness: o.sweetness ? SWEETNESS_DEFAULT : undefined,
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

/** Extras in the item's canonical order (so menu + maker selections in any tap order are identical). */
export function normalizeExtras(item: MenuItem, extras: readonly string[]): string[] {
  const order = item.options.extras?.map((e) => e.id) ?? []
  return [...new Set(extras)].filter((e) => order.includes(e)).sort((a, b) => order.indexOf(a) - order.indexOf(b))
}

export function unitPriceFor(item: PricedItem, sel: OptionSelection): number {
  const o: ItemOptions = item.options
  let price = item.price
  for (const group of Object.keys(SELECTION_KEY) as SingleGroup[]) {
    price += find(o[group], sel[SELECTION_KEY[group]])?.priceDelta ?? 0
  }
  for (const id of sel.extras) price += find(o.extras, id)?.priceDelta ?? 0
  return price
}

/** Short chips for the cart line, e.g. ["Large", "Iced", "Oat milk", "Desi Hot 🌶️", "+ Extra shot", "Sweetness 25%"]. */
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
  for (const id of normalizeExtras(item, sel.extras)) {
    const extra = find(o.extras, id)
    if (extra) labels.push(`+ ${extra.label}`)
  }
  if (o.sweetness && sel.sweetness !== undefined && sel.sweetness !== SWEETNESS_DEFAULT) labels.push(`Sweetness ${sel.sweetness}%`)
  return labels
}

/** Rebuild an OptionSelection from a stored cart line (menu items / coffees). */
export function selectionFromOptions(o: CartOptions): OptionSelection {
  return { size: o.size, temp: o.temp, milk: o.milk, spice: o.spice, extras: [...(o.extras ?? [])], sweetness: o.sweetness }
}

export type LinePrice = { available: true; unitPrice: number } | { available: false }

const has = (list: readonly { id: string }[], id: string) => list.some((c) => c.id === id)
/** A chosen single-option id must still exist in its group (when the group exists). */
const validSingle = (choices: OptionChoice[] | undefined, id: string | undefined) => !id || !choices || has(choices, id)

/**
 * Re-price ANY persisted cart line from the current data files (menu, burger, wrap, deals).
 * localStorage may hold old prices after the owner edits data → the drawer and checkout call this.
 * Missing item / ingredient / option → `{ available: false }` (sending is blocked until removed).
 */
export function priceLine(line: Pick<CartItem, 'itemId' | 'category' | 'options'>): LinePrice {
  const o = line.options
  if (line.itemId === 'custom-burger') {
    if (site.craftMakers.burger !== 'order') return { available: false }
    const layers = o.layers ?? []
    if (!layers.every((id) => has(BURGER_BUILDER.ingredients, id))) return { available: false }
    return { available: true, unitPrice: burgerPrice(layers as BurgerLayerId[]) }
  }
  if (line.itemId === 'custom-wrap') {
    if (site.craftMakers.wrap !== 'order') return { available: false }
    const w = o.wrap
    const M = WRAP_MAKER
    const ok =
      w &&
      has(M.bases, w.base) &&
      has(M.proteins, w.protein) &&
      has(M.spice, w.spice) &&
      w.cheeses.every((id) => has(M.cheeses, id)) &&
      w.veggies.every((id) => has(M.veggies, id)) &&
      w.sauces.every((id) => has(M.sauces, id))
    return ok ? { available: true, unitPrice: wrapPrice(w) } : { available: false }
  }
  if (line.category === 'deal') {
    const deal = deals.find((d) => d.id === line.itemId)
    if (!deal || !deal.items.every((l) => { const i = getItemById(l.itemId); return Boolean(i && isPriced(i)) })) return { available: false }
    return { available: true, unitPrice: deal.price }
  }
  const item = getItemById(line.itemId)
  // Gone from the menu, or its price was removed ("Price coming soon") → can't be sent.
  if (!item || !isPriced(item)) return { available: false }
  const sel = selectionFromOptions(o)
  const io = item.options
  const valid =
    validSingle(io.sizes, sel.size) &&
    validSingle(io.temps, sel.temp) &&
    validSingle(io.milks, sel.milk) &&
    (!sel.spice || !item.spiceLevels || item.spiceLevels.includes(sel.spice)) &&
    sel.extras.every((id) => has(io.extras ?? [], id))
  return valid ? { available: true, unitPrice: unitPriceFor(item, sel) } : { available: false }
}

/**
 * Re-price persisted lines. `priceChanged` → show "Some prices were updated." once;
 * `changed` also covers lines that became (un)available.
 */
export function repriceLines(items: readonly CartItem[]): { items: CartItem[]; changed: boolean; priceChanged: boolean } {
  let changed = false
  let priceChanged = false
  const next = items.map((line) => {
    const p = priceLine(line)
    if (!p.available) {
      if (line.unavailable) return line
      changed = true
      return { ...line, unavailable: true }
    }
    if (p.unitPrice === line.unitPrice && !line.unavailable) return line
    changed = true
    if (p.unitPrice !== line.unitPrice) priceChanged = true
    return { ...line, unitPrice: p.unitPrice, unavailable: undefined }
  })
  return { items: next, changed, priceChanged }
}

/** Turn a menu item + selection into a cart line input. Menu modal and Coffee maker both use this. */
export function toCartInput(item: PricedItem, sel: OptionSelection = defaultSelection(item)): AddItemInput {
  const extras = normalizeExtras(item, sel.extras)
  const options: CartOptions = {
    size: sel.size,
    temp: sel.temp,
    milk: sel.milk,
    spice: sel.spice,
    extras,
    sweetness: item.options.sweetness ? (sel.sweetness ?? SWEETNESS_DEFAULT) : undefined,
  }
  return {
    itemId: item.id,
    slug: item.slug,
    name: item.name,
    image: item.image,
    emoji: item.emoji,
    category: item.category,
    unitPrice: unitPriceFor(item, { ...sel, extras }),
    options,
    optionLabels: optionLabels(item, { ...sel, extras }),
  }
}
