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
 * No deals yet: the café's current list has none (2026-11-11). Home hides the deals strip and /deals says
 * "coming soon" while this is empty. To add one: { id, slug, name, tagline, emoji, items: [{ itemId, qty }],
 * price, type, availability?, window? }. Every item must exist in data/menu.ts WITH a price, or the deal can't be ordered.
 */
export const deals: Deal[] = []

/** Sum of the individual menu prices for everything in the deal. */
export function getDealOriginalPrice(deal: Deal): number {
  return deal.items.reduce((sum, line) => sum + (getItemById(line.itemId)?.price ?? 0) * line.qty, 0)
}

/** Real savings vs ordering items separately (never negative). */
export function getDealSavings(deal: Deal): number {
  return Math.max(0, getDealOriginalPrice(deal) - deal.price)
}

export const getDealBySlug = (slug: string): Deal | undefined => deals.find((d) => d.slug === slug)
