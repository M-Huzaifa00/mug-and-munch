/**
 * Coffee maker data. Drinks and their options (only Hot / Cold / Blended on the flavoured lattes) come FROM
 * data/menu.ts, so a maker coffee and the same menu coffee produce identical cart lines at the menu price.
 * Only icons, tints and defaults live here.
 */
import { getItemsByCategory, isPriced } from './menu'
import type { IconSpec } from './builder'

/** Coffees offered in the maker: every priced item in the Coffee category, in menu order. */
export const COFFEE_DRINKS: readonly string[] = getItemsByCategory('coffee')
  .filter(isPriced)
  .map((i) => i.id)

export const COFFEE_DEFAULTS = { drink: 'latte', size: 'm', milk: 'regular', temp: 'hot', sweetness: 50 } as const

export const COFFEE_FUN_NAMES = ['Study Grind Fuel', 'The 2 AM Deadline', 'F-7 Morning Hug', 'Exam Week Elixir']

/** Liquid tint per drink (token-based). */
export const DRINK_TONE: Record<string, IconSpec['tone']> = {
  espresso: 'espresso',
  americano: 'espresso',
  cappuccino: 'caramel',
  latte: 'caramel',
  'flat-white': 'caramel',
  mocha: 'espresso',
  'caramel-latte': 'caramel',
  'hazelnut-latte': 'caramel',
  'spanish-latte': 'cheese',
  'french-vanilla-latte': 'cheese',
  'tiramisu-latte': 'caramel',
}

/** Drinks served without milk (cup art shows a dark liquid). */
export const BLACK_DRINKS: readonly string[] = ['espresso', 'americano']

export const OPTION_ICON: Record<string, IconSpec> = {
  s: { shape: 'cup', tone: 'caramel', n: 1 },
  m: { shape: 'cup', tone: 'caramel', n: 2 },
  l: { shape: 'cup', tone: 'caramel', n: 3 },
  regular: { shape: 'carton', tone: 'oat' },
  oat: { shape: 'carton', tone: 'cheese' },
  almond: { shape: 'carton', tone: 'caramel' },
  hot: { shape: 'flame', tone: 'chili' },
  iced: { shape: 'ice', tone: 'oat' },
  cold: { shape: 'ice', tone: 'oat' },
  blended: { shape: 'swirl', tone: 'caramel' },
  'extra-shot': { shape: 'shot', tone: 'espresso' },
  'caramel-syrup': { shape: 'drop', tone: 'caramel' },
  'hazelnut-syrup': { shape: 'drop', tone: 'espresso' },
  'vanilla-syrup': { shape: 'drop', tone: 'cheese' },
  'whipped-cream': { shape: 'swirl', tone: 'oat' },
}
