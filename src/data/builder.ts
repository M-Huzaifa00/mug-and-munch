// PLACEHOLDER PRICES — owner to update
/**
 * Shared builder types + the Burger maker data. Owner-editable.
 * Icons are small inline SVGs (see components/builder/IngredientIcon.tsx): `{ shape, tone }`.
 */

export type IconShape =
  | 'patty' | 'slice' | 'rings' | 'drop' | 'leaf' | 'bun' | 'flat' | 'chunks' | 'cup' | 'carton'
  | 'flame' | 'ice' | 'shot' | 'swirl' | 'chili' | 'tomato' | 'cucumber' | 'dots'
export type IconTone = 'chili' | 'cheese' | 'caramel' | 'pickle' | 'bubblegum' | 'oat' | 'espresso'

export interface IconSpec {
  shape: IconShape
  tone?: IconTone
  /** Count / size hint (chili peppers, cup size, …). */
  n?: number
}

/** One tappable choice in any maker. */
export interface BuilderChoice<Id extends string = string> {
  id: Id
  label: string
  /** PKR added (per unit for counters). */
  price: number
  icon: IconSpec
  /** Max units (counters). */
  max?: number
}

/** Kept for the Phase 4 helpers (same shape minus the icon). */
export type BuilderIngredient<Id extends string = string> = Omit<BuilderChoice<Id>, 'icon'> & { emoji?: string; max: number }

/* ---------- Burger maker ---------- */
export type BurgerLayerId = 'patty' | 'cheese' | 'jalapeno' | 'sauce' | 'lettuce' | 'onion' | 'bun'

export const BURGER_BUILDER = {
  /** Bottom + top bun, always included. Tapping "Top bun" closes the burger (auto-added on add). */
  basePrice: 350,
  maxLayers: 10,
  image: '/images/burgers/build-your-own.webp',
  fallbackName: 'Custom Burger',
  /** First detail on the kitchen ticket (the bun is always included). */
  bunLabel: 'Sesame bun',
  funNames: ['The F-7 Special', 'Midnight Monster', 'Blue Area Banger', 'The G-11 Stack', 'Desi Smash Bomb', 'The Margalla Melt', 'Jinnah Avenue Giant'],
  ingredients: [
    { id: 'patty', label: 'Smash patty', price: 450, max: 3, icon: { shape: 'patty' } },
    { id: 'cheese', label: 'Cheese', price: 150, max: 3, icon: { shape: 'slice', tone: 'cheese' } },
    { id: 'jalapeno', label: 'Jalapeños', price: 100, max: 2, icon: { shape: 'rings', tone: 'pickle' } },
    { id: 'sauce', label: 'House sauce', price: 50, max: 2, icon: { shape: 'drop', tone: 'chili' } },
    { id: 'lettuce', label: 'Lettuce', price: 60, max: 2, icon: { shape: 'leaf', tone: 'pickle' } },
    { id: 'onion', label: 'Onion', price: 60, max: 2, icon: { shape: 'rings', tone: 'bubblegum' } },
    { id: 'bun', label: 'Top bun', price: 0, max: 1, icon: { shape: 'bun' } },
  ] satisfies (BuilderChoice<BurgerLayerId> & { max: number })[],
} as const
