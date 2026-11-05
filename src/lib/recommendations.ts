/**
 * "Goes great with…" upsell rules for the cart drawer.
 * - coffee in cart  → a dessert / cookie
 * - burger in cart  → fries + a drink
 * - wrap in cart    → a drink
 * Never suggests something already in the cart. Owner can tweak the id lists below.
 */
import { getItemById, type Category, type MenuItem } from '@/data/menu'
import type { CartItem } from '@/store/cart'

const RULES: Partial<Record<Category, string[]>> = {
  coffee: ['choc-chunk-cookie', 'nutella-brownie', 'lotus-cheesecake'],
  burger: ['classic-fries', 'soft-drink', 'masala-fries', 'mint-margarita', 'loaded-fries'],
  wrap: ['mint-margarita', 'fresh-lime', 'soft-drink'],
}

/** Used when the cart has items but no rule matched (e.g. only sides). */
const FALLBACK = ['spanish-latte', 'choc-chunk-cookie', 'classic-fries', 'mint-margarita']

export function getUpsells(cart: CartItem[], limit = 3): MenuItem[] {
  if (cart.length === 0) return []
  const inCart = new Set(cart.map((i) => i.itemId))
  const categories = new Set(cart.map((i) => i.category))

  // Interleave rules so a burger + coffee cart gets fries AND a cookie, not 3 fries.
  const lists = (Object.keys(RULES) as Category[]).filter((c) => categories.has(c)).map((c) => RULES[c] ?? [])
  const ordered: string[] = []
  for (let i = 0; lists.some((l) => i < l.length); i++) {
    for (const list of lists) {
      const id = list[i]
      if (id) ordered.push(id)
    }
  }
  ordered.push(...FALLBACK)

  const picks: MenuItem[] = []
  for (const id of ordered) {
    if (picks.length >= limit) break
    if (inCart.has(id) || picks.some((p) => p.id === id)) continue
    const item = getItemById(id)
    if (item) picks.push(item)
  }
  return picks
}
