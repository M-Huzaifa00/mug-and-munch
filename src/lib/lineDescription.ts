import { BURGER_BUILDER } from '@/data/builder'
import { COFFEE_DRINKS } from '@/data/coffeeBuilder'
import { deals } from '@/data/deals'
import { getItemById, SPICE_LABELS, SWEETNESS_DEFAULT, type MenuItem } from '@/data/menu'
import { wrapLabels } from '@/lib/wrapBuilder'
import type { CartItem } from '@/store/cart'

export type LineKind = 'burger' | 'wrap' | 'coffee' | 'deal' | 'item'

export interface LineDescription {
  kind: LineKind
  /** Bold title: quoted custom name, drink / item / deal name. */
  title: string
  /** Sticker chip for custom lines + deals. */
  tag?: string
  /** Kitchen-ready details, in order. */
  details: string[]
  emoji: string
  /** Editable in the Craft section: Edit (burger/wrap) or Tweak (coffee). */
  edit?: { tab: 'burger' | 'wrap' | 'coffee'; label: 'Edit' | 'Tweak' }
}

type Line = Pick<CartItem, 'itemId' | 'name' | 'emoji' | 'category' | 'options' | 'optionLabels'>

const quoted = (name: string | undefined, fallback: string) => (name ? `"${name}"` : fallback)
const findLabel = (list: readonly { id: string; label: string }[] | undefined, id: string | undefined) => list?.find((c) => c.id === id)?.label

/** Bun, then layers bottom → top with duplicates grouped (×2), sauces last. */
function burgerDetails(layers: readonly string[]): string[] {
  const ING = BURGER_BUILDER.ingredients
  const order: string[] = []
  for (const id of layers) if (id !== 'bun' && !order.includes(id)) order.push(id)
  const isSauce = (id: string) => id === 'sauce'
  const sorted = [...order.filter((id) => !isSauce(id)), ...order.filter(isSauce)]
  return [
    BURGER_BUILDER.bunLabel,
    ...sorted.map((id) => {
      const n = layers.filter((l) => l === id).length
      return `${ING.find((i) => i.id === id)?.label ?? id}${n > 1 ? ` ×${n}` : ''}`
    }),
  ]
}

/** Coffee: size, milk, Hot/Iced, add-ons; sweetness only when not the default. Menu + maker read the same. */
function coffeeDetails(item: MenuItem, o: Line['options']): string[] {
  const io = item.options
  const out: string[] = []
  const size = findLabel(io.sizes, o.size)
  if (size) out.push(size)
  const milk = findLabel(io.milks, o.milk)
  if (milk) out.push(milk)
  const temp = findLabel(io.temps, o.temp)
  if (temp) out.push(temp)
  const order = io.extras?.map((e) => e.id) ?? []
  for (const id of [...(o.extras ?? [])].sort((a, b) => order.indexOf(a) - order.indexOf(b))) {
    const label = findLabel(io.extras, id)
    if (label) out.push(label)
  }
  if (o.sweetness !== undefined && o.sweetness !== SWEETNESS_DEFAULT) out.push(`Sweetness ${o.sweetness}%`)
  return out
}

/** Normal items: size, spice, extras (+). */
function itemDetails(item: MenuItem, o: Line['options']): string[] {
  const io = item.options
  const out: string[] = []
  const size = findLabel(io.sizes, o.size)
  if (size) out.push(size)
  if (o.spice) out.push(SPICE_LABELS[o.spice])
  const order = io.extras?.map((e) => e.id) ?? []
  for (const id of [...(o.extras ?? [])].sort((a, b) => order.indexOf(a) - order.indexOf(b))) {
    const label = findLabel(io.extras, id)
    if (label) out.push(`+${label}`)
  }
  return out
}

/**
 * ONE formatter for a cart line, used by the CartDrawer, checkout, WhatsApp message and success page,
 * so a line reads the same everywhere. Built from the current data files (falls back to the stored
 * labels when something no longer exists).
 */
export function describeLine(line: Line): LineDescription {
  const o = line.options
  if (line.itemId === 'custom-burger') {
    return { kind: 'burger', title: quoted(o.name, BURGER_BUILDER.fallbackName), tag: 'Custom burger 🍔', details: burgerDetails(o.layers ?? []), emoji: '🍔', edit: { tab: 'burger', label: 'Edit' } }
  }
  if (line.itemId === 'custom-wrap' && o.wrap) {
    return { kind: 'wrap', title: quoted(o.name, 'Custom Wrap'), tag: 'Custom wrap 🌯', details: wrapLabels(o.wrap), emoji: '🌯', edit: { tab: 'wrap', label: 'Edit' } }
  }
  if (line.category === 'deal') {
    const deal = deals.find((d) => d.id === line.itemId)
    const details = deal
      ? deal.items.map((l) => `${l.qty > 1 ? `${l.qty}× ` : ''}${getItemById(l.itemId)?.name ?? l.itemId}`)
      : line.optionLabels
    return { kind: 'deal', title: deal?.name ?? line.name, tag: 'Deal', details, emoji: '🎁' }
  }
  const item = getItemById(line.itemId)
  if (!item) return { kind: 'item', title: line.name, details: line.optionLabels, emoji: line.emoji }
  if (item.category === 'coffee') {
    const tweakable = (COFFEE_DRINKS as readonly string[]).includes(item.id)
    return { kind: 'coffee', title: item.name, details: coffeeDetails(item, o), emoji: '☕', edit: tweakable ? { tab: 'coffee', label: 'Tweak' } : undefined }
  }
  return { kind: 'item', title: item.name, details: itemDetails(item, o), emoji: item.emoji }
}
