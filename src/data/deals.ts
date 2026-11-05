/**
 * Combo deals. PLACEHOLDER PRICES — owner to update.
 * "Save Rs X" is ALWAYS computed from real menu prices; never hardcode savings.
 */
import { getItemById } from './menu'

export interface DealLine {
  itemId: string
  qty: number
}

export interface Deal {
  id: string
  slug: string
  name: string
  tagline: string
  emoji: string
  items: DealLine[]
  price: number
  /** Honest availability note (no fake timers). */
  availability?: string
}

export const deals: Deal[] = [
  {
    id: 'student-deal',
    slug: 'student-deal',
    name: 'Student Deal',
    tagline: 'Budget tight, bhook full.',
    emoji: '🎒',
    items: [
      { itemId: 'classic-smash', qty: 1 },
      { itemId: 'classic-fries', qty: 1 },
      { itemId: 'soft-drink', qty: 1 },
    ],
    price: 1199,
    availability: 'Show your student card at pickup', // TODO: owner confirms rule
  },
  {
    id: 'study-grind',
    slug: 'study-grind',
    name: 'Study Grind',
    tagline: 'Two lattes, two cookies, zero sleep.',
    emoji: '📚',
    items: [
      { itemId: 'classic-latte', qty: 2 },
      { itemId: 'choc-chunk-cookie', qty: 2 },
    ],
    price: 1699,
  },
  {
    id: 'midnight-deal',
    slug: 'midnight-deal',
    name: 'Midnight Deal',
    tagline: 'Late-night munchies sorted.',
    emoji: '🌙',
    items: [
      { itemId: 'double-smash', qty: 1 },
      { itemId: 'loaded-fries', qty: 1 },
      { itemId: 'cold-brew', qty: 1 },
    ],
    price: 2199,
    availability: 'Available 11 PM till close', // TODO: owner confirms window
  },
  {
    id: 'duo-deal',
    slug: 'duo-deal',
    name: 'Duo Deal',
    tagline: 'For you + your favourite person.',
    emoji: '💕',
    items: [
      { itemId: 'classic-smash', qty: 2 },
      { itemId: 'classic-fries', qty: 2 },
      { itemId: 'spanish-latte', qty: 2 },
    ],
    price: 3499,
  },
]

/** Sum of the individual menu prices for everything in the deal. */
export function getDealOriginalPrice(deal: Deal): number {
  return deal.items.reduce((sum, line) => sum + (getItemById(line.itemId)?.price ?? 0) * line.qty, 0)
}

/** Real savings vs ordering items separately (never negative). */
export function getDealSavings(deal: Deal): number {
  return Math.max(0, getDealOriginalPrice(deal) - deal.price)
}

export const getDealBySlug = (slug: string): Deal | undefined => deals.find((d) => d.slug === slug)
