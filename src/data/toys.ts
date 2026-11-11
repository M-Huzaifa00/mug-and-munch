/**
 * Data for the Vibe Picker and Snack Roulette. Owner-editable.
 * (Maker data lives in data/builder.ts, data/coffeeBuilder.ts and data/wrapBuilder.ts.)
 */

/* ---------- What's your vibe? ---------- */
export interface Vibe {
  id: string
  label: string
  emoji: string
  /** Caveat note shown when picked. */
  line: string
  /** Exactly 3 menu item ids (slugs). */
  picks: [string, string, string]
}

// Picks can include items without a price yet; the picker only adds the ones that have one.
export const VIBES: Vibe[] = [
  { id: 'sleepy', label: 'Sleepy', emoji: '😴', line: 'caffeine incoming ☕', picks: ['americano', 'spanish-latte', 'tiramisu-latte'] },
  { id: 'hangry', label: 'Hangry', emoji: '😤', line: 'go big or go home 🍔', picks: ['smash-beast', 'munch-hellfire', 'munch-signature-steak'] },
  { id: 'study', label: 'Study grind', emoji: '📚', line: 'fuel for the all-nighter', picks: ['flat-white', 'classic-matcha', 'jalapeno-jolt'] },
  { id: 'chill', label: 'Thirsty', emoji: '🧊', line: 'instant cool-down sorted', picks: ['blue-mint-mojito', 'peach-iced-tea', 'green-apple-mojito'] },
  { id: 'midnight', label: 'Midnight munchies', emoji: '🌙', line: 'late-night munchies sorted', picks: ['munch-zinger-burger', 'loaded-fries', 'tea-chai'] },
]

/* ---------- Snack Roulette ---------- */
/** Menu item ids on the wheel (6–10 works best). Honest: normal prices, no fake discounts.
 *  Only items WITH a price land on the wheel (unpriced ids are skipped), so add burgers/wraps once priced. */
export const ROULETTE_ITEMS = [
  'spanish-latte',
  'strawberry-matcha',
  'mocha',
  'blue-mint-mojito',
  'caramel-latte',
  'peach-iced-tea',
  'tiramisu-latte',
  'green-apple-mojito',
]
