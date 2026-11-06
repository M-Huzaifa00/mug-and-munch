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

export const VIBES: Vibe[] = [
  { id: 'sleepy', label: 'Sleepy', emoji: '😴', line: 'caffeine incoming ☕', picks: ['cold-brew', 'spanish-latte', 'choc-chunk-cookie'] },
  { id: 'hangry', label: 'Hangry', emoji: '😤', line: 'go big or go home 🍔', picks: ['double-smash', 'loaded-fries', 'smoky-bbq-stack'] },
  { id: 'study', label: 'Study grind', emoji: '📚', line: 'fuel for the all-nighter', picks: ['pistachio-latte', 'chicken-tikka-wrap', 'choc-chunk-cookie'] },
  { id: 'date', label: 'Date night', emoji: '💕', line: 'share the cheesecake. or don’t.', picks: ['lotus-cheesecake', 'spanish-latte', 'mushroom-swiss'] },
  { id: 'midnight', label: 'Midnight munchies', emoji: '🌙', line: 'late-night munchies sorted', picks: ['classic-smash', 'karak-chai', 'loaded-fries'] },
]

/* ---------- Snack Roulette ---------- */
/** Menu item ids on the wheel (6–10 works best). Honest: normal prices, no fake discounts. */
export const ROULETTE_ITEMS = [
  'classic-smash',
  'spanish-latte',
  'chicken-tikka-wrap',
  'loaded-fries',
  'mocha',
  'peri-peri-wrap',
  'nutella-brownie',
  'mint-margarita',
]
