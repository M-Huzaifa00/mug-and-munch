/**
 * Data for the home "toys" (Phase 4). Owner-editable.
 * PLACEHOLDER PRICES — owner to update.
 */

/* ---------- Build Your Burger ---------- */
export type BurgerLayerId = 'patty' | 'cheese' | 'jalapeno' | 'sauce' | 'lettuce' | 'onion' | 'bun'

export interface BurgerIngredient {
  id: BurgerLayerId
  label: string
  emoji: string
  /** PKR added per layer. */
  price: number
  /** Max times this layer can be stacked. */
  max: number
}

export const BURGER_BUILDER = {
  /** Bottom + top bun, always included. Tapping "Top bun" closes the burger (auto-added on checkout). */
  basePrice: 350,
  /** Hard cap so the tower stays on screen. */
  maxLayers: 10,
  /** Cart image (styled fallback until a photo exists). */
  image: '/images/burgers/build-your-own.webp',
  ingredients: [
    { id: 'patty', label: 'Smash patty', emoji: '🥩', price: 450, max: 3 },
    { id: 'cheese', label: 'Cheese', emoji: '🧀', price: 150, max: 3 },
    { id: 'jalapeno', label: 'Jalapeños', emoji: '🌶️', price: 100, max: 2 },
    { id: 'sauce', label: 'House sauce', emoji: '🥫', price: 50, max: 2 },
    { id: 'lettuce', label: 'Lettuce', emoji: '🥬', price: 60, max: 2 },
    { id: 'onion', label: 'Onion', emoji: '🧅', price: 60, max: 2 },
    { id: 'bun', label: 'Top bun', emoji: '🍞', price: 0, max: 1 },
  ] satisfies BurgerIngredient[],
} as const

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
