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
 * Deals (2026-11-12). TODO(owner): PROPOSED combos + prices by the developer, not yet approved by the café.
 * Priced from the menu where it has prices and from Islamabad market research for the rest (zinger ~Rs 500–600,
 * single smash ~Rs 850–1,375, double smash ~Rs 1,150–1,250, loaded fries ~Rs 630–1,195, wings ~Rs 470–1,095;
 * Foodpanda / MenuPak listings, Nov 2026). Confirm or edit with Syed Ahmed before launch.
 * A deal is ordered at ITS OWN price, so items without an individual menu price are fine inside a deal;
 * "Save Rs X" only shows when every item has a real menu price (never computed from guesses).
 * Format: { id, slug, name, tagline, emoji, items: [{ itemId, qty }], price, type, availability?, window? }.
 */
export const deals: Deal[] = [
  {
    id: 'student-saver',
    slug: 'student-saver',
    name: 'Student Saver',
    tagline: 'exam week fuel, wallet approved',
    emoji: '🎒',
    items: [
      { itemId: 'munch-zinger-burger', qty: 1 },
      { itemId: 'simple-fries', qty: 1 },
      { itemId: 'tea-chai', qty: 1 },
    ],
    price: 999,
    type: 'solo',
  },
  {
    id: 'coffee-and-club',
    slug: 'coffee-and-club',
    name: 'Coffee & Club',
    tagline: 'the study-session classic',
    emoji: '🥪',
    items: [
      { itemId: 'munch-club', qty: 1 },
      { itemId: 'spanish-latte', qty: 1 },
    ],
    price: 1349,
    type: 'coffee',
  },
  {
    id: 'wing-it',
    slug: 'wing-it',
    name: 'Wing It',
    tagline: 'wings, fries, cold mojito. done.',
    emoji: '🍗',
    items: [
      { itemId: 'golden-munch-wings', qty: 1 },
      { itemId: 'simple-fries', qty: 1 },
      { itemId: 'green-apple-mojito', qty: 1 },
    ],
    price: 1449,
    type: 'solo',
  },
  {
    id: 'matcha-duo',
    slug: 'matcha-duo',
    name: 'Matcha Duo',
    tagline: 'one pink, one vanilla, both for you two',
    emoji: '🍵',
    items: [
      { itemId: 'strawberry-matcha', qty: 1 },
      { itemId: 'vanilla-matcha', qty: 1 },
    ],
    price: 1749,
    type: 'coffee',
  },
  {
    id: 'midnight-munch',
    slug: 'midnight-munch',
    name: 'Midnight Munch',
    tagline: 'for the 1 AM cravings',
    emoji: '🌙',
    items: [
      { itemId: 'smash-beast', qty: 1 },
      { itemId: 'loaded-fries', qty: 1 },
      { itemId: 'blue-mint-mojito', qty: 1 },
    ],
    price: 2199,
    type: 'late-night',
    window: { start: '23:00', end: '02:00' },
  },
  {
    id: 'hellfire-duo',
    slug: 'hellfire-duo',
    name: 'Hellfire Duo',
    tagline: 'two brave souls, one spicy night',
    emoji: '🔥',
    items: [
      { itemId: 'munch-hellfire', qty: 2 },
      { itemId: 'loaded-fries', qty: 1 },
      { itemId: 'blue-mint-mojito', qty: 2 },
    ],
    price: 3399,
    type: 'sharing',
  },
  {
    id: 'squad-box',
    slug: 'squad-box',
    name: 'Squad Box',
    tagline: 'the whole gang, sorted',
    emoji: '📦',
    items: [
      { itemId: 'munch-overload', qty: 2 },
      { itemId: 'bbq-blaze', qty: 2 },
      { itemId: 'loaded-fries', qty: 2 },
      { itemId: 'peach-iced-tea', qty: 4 },
    ],
    price: 5999,
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

export const getDealBySlug = (slug: string): Deal | undefined => deals.find((d) => d.slug === slug)
