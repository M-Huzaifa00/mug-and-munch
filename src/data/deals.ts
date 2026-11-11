/**
 * Combo deals (owner data).
 * "Save Rs X" is ALWAYS computed from real menu prices; never hardcode savings.
 */
import { getItemById } from './menu'

export interface DealLine {
  itemId: string
  qty: number
}

/** Filter group on the Deals page. */
export type DealType = 'solo' | 'sharing' | 'late-night' | 'coffee'

export const DEAL_TYPE_LABELS: Record<DealType, string> = { solo: 'Solo 🎒', sharing: 'Sharing 💕', 'late-night': 'Late night 🌙', coffee: 'Coffee ☕' }

export interface Deal {
  id: string
  slug: string
  name: string
  tagline: string
  emoji: string
  items: DealLine[]
  price: number
  type: DealType
  /** Honest rule note (no fake timers), e.g. student card. */
  availability?: string
  /** Daily window in Asia/Karachi (24h "HH:MM"; end <= start means it runs past midnight). No countdowns. */
  window?: { start: string; end: string }
}

/**
 * Deals (2026-11-12). TODO(owner): combos + prices proposed by the developer; confirm with Syed Ahmed.
 * Owner rule: deals use ONLY menu items that have a real price, so every deal shows an honest, computed
 * "Save Rs X · -Y%" (getDealSavings / getDealSavingsPercent). Food deals can follow once burgers/wraps are priced.
 * Format: { id, slug, name, tagline, emoji, items: [{ itemId, qty }], price, type, availability?, window? }.
 */
export const deals: Deal[] = [
  {
    id: 'study-buddy',
    slug: 'study-buddy',
    name: 'Study Buddy',
    tagline: 'two americanos, zero sleep',
    emoji: '📚',
    items: [{ itemId: 'americano', qty: 2 }],
    price: 849,
    type: 'coffee',
  },
  {
    id: 'latte-love',
    slug: 'latte-love',
    name: 'Latte Love',
    tagline: 'one Spanish, one caramel, for you two',
    emoji: '💕',
    items: [{ itemId: 'spanish-latte', qty: 1 }, { itemId: 'caramel-latte', qty: 1 }],
    price: 1249,
    type: 'sharing',
  },
  {
    id: 'chai-time',
    slug: 'chai-time',
    name: 'Chai Time',
    tagline: '3 cups, endless gup-shup',
    emoji: '☕',
    items: [{ itemId: 'tea-chai', qty: 3 }],
    price: 749,
    type: 'sharing',
  },
  {
    id: 'midnight-brew',
    slug: 'midnight-brew',
    name: 'Midnight Brew',
    tagline: 'mocha + tiramisu for the 1 AM grind',
    emoji: '🌙',
    items: [{ itemId: 'mocha', qty: 1 }, { itemId: 'tiramisu-latte', qty: 1 }],
    price: 1199,
    type: 'late-night',
    window: { start: '23:00', end: '02:00' },
  },
  {
    id: 'matcha-duo',
    slug: 'matcha-duo',
    name: 'Matcha Duo',
    tagline: 'one pink, one vanilla',
    emoji: '🍵',
    items: [{ itemId: 'strawberry-matcha', qty: 1 }, { itemId: 'vanilla-matcha', qty: 1 }],
    price: 1649,
    type: 'coffee',
  },
  {
    id: 'chill-pack',
    slug: 'chill-pack',
    name: 'Chill Pack',
    tagline: 'two mojitos + a peach iced tea',
    emoji: '🧊',
    items: [{ itemId: 'green-apple-mojito', qty: 1 }, { itemId: 'blue-mint-mojito', qty: 1 }, { itemId: 'peach-iced-tea', qty: 1 }],
    price: 1799,
    type: 'sharing',
  },
  {
    id: 'squad-sips',
    slug: 'squad-sips',
    name: 'Squad Sips',
    tagline: '2 Spanish lattes + 2 Blue Mint mojitos',
    emoji: '🎉',
    items: [{ itemId: 'spanish-latte', qty: 2 }, { itemId: 'blue-mint-mojito', qty: 2 }],
    price: 2499,
    type: 'sharing',
  },
]

/** Sum of the individual menu prices, or null when any item has no menu price yet (then no savings are shown). */
export function getDealOriginalPrice(deal: Deal): number | null {
  let sum = 0
  for (const line of deal.items) {
    const price = getItemById(line.itemId)?.price
    if (price === null || price === undefined) return null
    sum += price * line.qty
  }
  return sum
}

/** Real savings vs ordering items separately (never negative; 0 when it can't be computed honestly). */
export function getDealSavings(deal: Deal): number {
  const original = getDealOriginalPrice(deal)
  return original === null ? 0 : Math.max(0, original - deal.price)
}

/** Whole-percent saving (0 when it can't be computed). */
export function getDealSavingsPercent(deal: Deal): number {
  const original = getDealOriginalPrice(deal)
  return original ? Math.round((getDealSavings(deal) / original) * 100) : 0
}

/** The deal with the biggest % saving (the "Best value" ribbon). */
export const getBestValueDeal = (): Deal | undefined => [...deals].sort((x, y) => getDealSavingsPercent(y) - getDealSavingsPercent(x))[0]

export const getDealBySlug = (slug: string): Deal | undefined => deals.find((d) => d.slug === slug)
