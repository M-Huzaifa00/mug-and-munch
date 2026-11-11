/**
 * "Goes great with…" upsell rules for the cart drawer.
 * - coffee in cart          → a matcha / iced drink to try next
 * - burger / steak / wrap   → a cold drink
 * - matcha / drinks         → a flavoured latte
 * Never suggests something already in the cart or without a price. Owner can tweak the id lists below.
 */
import { getItemById, isPriced, type Category, type MenuItem } from '@/data/menu'
import type { CartItem } from '@/store/cart'

const RULES: Partial<Record<Category, string[]>> = {
  coffee: ['strawberry-matcha', 'peach-iced-tea', 'blue-mint-mojito'],
  // Fries first: skipped automatically until they have a price.
  burger: ['simple-fries', 'loaded-fries', 'blue-mint-mojito', 'green-apple-mojito', 'peach-iced-tea'],
  starters: ['blue-mint-mojito', 'peach-iced-tea', 'green-apple-mojito'],
  steak: ['green-apple-mojito', 'raspberry-iced-tea', 'blue-mint-mojito'],
  wrap: ['simple-fries', 'peach-iced-tea', 'blue-mint-mojito', 'raspberry-iced-tea'],
  matcha: ['spanish-latte', 'tiramisu-latte'],
  drinks: ['spanish-latte', 'caramel-latte'],
}

/** Used when the cart has items but no rule matched. */
const FALLBACK = ['spanish-latte', 'blue-mint-mojito', 'strawberry-matcha', 'tea-chai']

export function getUpsells(cart: CartItem[], limit = 3): MenuItem[] {
  if (cart.length === 0) return []
  const inCart = new Set(cart.map((i) => i.itemId))
  const categories = new Set(cart.map((i) => i.category))

  // Interleave rules so a burger + coffee cart gets a mojito AND a matcha, not 3 of one kind.
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
    if (item && isPriced(item)) picks.push(item)
  }
  return picks
}
