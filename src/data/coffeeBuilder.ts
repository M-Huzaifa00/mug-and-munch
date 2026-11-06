// PLACEHOLDER PRICES — owner to update
/**
 * Coffee maker data. Drinks, sizes, milks, temps and add-ons come FROM data/menu.ts (the same option
 * sets the item modal uses), so a maker coffee and the same menu coffee produce identical cart lines.
 * Only icons and defaults live here.
 */
import type { IconSpec } from './builder'

/** Coffees offered in the maker (menu slugs). */
export const COFFEE_DRINKS = ['classic-latte', 'spanish-latte', 'caramel-macchiato', 'mocha', 'pistachio-latte', 'flat-white', 'americano', 'cold-brew'] as const

export const COFFEE_DEFAULTS = { drink: 'classic-latte', size: 'm', milk: 'regular', temp: 'hot', sweetness: 50 } as const

export const COFFEE_FUN_NAMES = ['Study Grind Fuel', 'The 2 AM Deadline', 'F-7 Morning Hug', 'Exam Week Elixir']

/** Liquid tint per drink (token-based). */
export const DRINK_TONE: Record<string, IconSpec['tone']> = {
  'classic-latte': 'caramel',
  'spanish-latte': 'cheese',
  'caramel-macchiato': 'caramel',
  mocha: 'espresso',
  'pistachio-latte': 'pickle',
  'flat-white': 'caramel',
  americano: 'espresso',
  'cold-brew': 'espresso',
}

export const OPTION_ICON: Record<string, IconSpec> = {
  s: { shape: 'cup', tone: 'caramel', n: 1 },
  m: { shape: 'cup', tone: 'caramel', n: 2 },
  l: { shape: 'cup', tone: 'caramel', n: 3 },
  regular: { shape: 'carton', tone: 'oat' },
  oat: { shape: 'carton', tone: 'cheese' },
  almond: { shape: 'carton', tone: 'caramel' },
  hot: { shape: 'flame', tone: 'chili' },
  iced: { shape: 'ice', tone: 'oat' },
  'extra-shot': { shape: 'shot', tone: 'espresso' },
  'caramel-syrup': { shape: 'drop', tone: 'caramel' },
  'hazelnut-syrup': { shape: 'drop', tone: 'espresso' },
  'vanilla-syrup': { shape: 'drop', tone: 'cheese' },
  'whipped-cream': { shape: 'swirl', tone: 'oat' },
}
