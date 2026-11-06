// PLACEHOLDER PRICES — owner to update
/** Wrap maker data. Owner can edit every group, price and fun name here. */
import type { SpiceLevel } from './menu'
import type { BuilderChoice } from './builder'

export type WrapBaseId = 'tortilla' | 'wheat' | 'paratha'
export type WrapProteinId = 'tikka' | 'malai' | 'crispy' | 'seekh' | 'paneer'
export type WrapCheeseId = 'cheddar' | 'mozzarella'
export type WrapVeggieId = 'lettuce' | 'onion' | 'tomato' | 'cucumber' | 'jalapeno' | 'pickled'
export type WrapSauceId = 'garlic' | 'mint' | 'chipotle' | 'imli' | 'house'

/** Everything a custom wrap is made of (stored on the cart line). */
export interface WrapChoice {
  base: WrapBaseId
  protein: WrapProteinId
  double: boolean
  cheeses: WrapCheeseId[]
  veggies: WrapVeggieId[]
  sauces: WrapSauceId[]
  spice: SpiceLevel
}

export const WRAP_MAKER = {
  basePrice: 250,
  /** Fillings on the board: protein (×2 if double) + cheeses + veggies + sauces. */
  maxFillings: 8,
  maxSauces: 3,
  image: '/images/wraps/build-your-own.webp',
  fallbackName: 'Custom Wrap',
  tooFull: 'Itna sab? Wrap phat jayega 😂',
  funNames: ['The G-9 Roll', 'Late Night Lapet', 'Blue Area Bundle', 'The F-10 Fold', 'Midnight Malai Roll', 'Desi Burrito Bhai'],
  bases: [
    { id: 'tortilla', label: 'Tortilla', price: 0, icon: { shape: 'flat', tone: 'cheese' } },
    { id: 'wheat', label: 'Whole-wheat', price: 50, icon: { shape: 'flat', tone: 'caramel' } },
    { id: 'paratha', label: 'Paratha', price: 80, icon: { shape: 'flat', tone: 'oat' } },
  ] satisfies BuilderChoice<WrapBaseId>[],
  proteins: [
    { id: 'tikka', label: 'Chicken tikka', price: 450, icon: { shape: 'chunks', tone: 'caramel' } },
    { id: 'malai', label: 'Malai boti', price: 450, icon: { shape: 'chunks', tone: 'oat' } },
    { id: 'crispy', label: 'Crispy chicken', price: 420, icon: { shape: 'chunks', tone: 'cheese' } },
    { id: 'seekh', label: 'Beef seekh', price: 480, icon: { shape: 'chunks', tone: 'espresso' } },
    { id: 'paneer', label: 'Paneer (Veg)', price: 380, icon: { shape: 'chunks', tone: 'bubblegum' } },
  ] satisfies BuilderChoice<WrapProteinId>[],
  cheeses: [
    { id: 'cheddar', label: 'Cheddar', price: 120, icon: { shape: 'slice', tone: 'cheese' } },
    { id: 'mozzarella', label: 'Mozzarella', price: 150, icon: { shape: 'slice', tone: 'oat' } },
  ] satisfies BuilderChoice<WrapCheeseId>[],
  veggies: [
    { id: 'lettuce', label: 'Lettuce', price: 40, max: 1, icon: { shape: 'leaf', tone: 'pickle' } },
    { id: 'onion', label: 'Onions', price: 40, max: 1, icon: { shape: 'rings', tone: 'bubblegum' } },
    { id: 'tomato', label: 'Tomato', price: 50, max: 1, icon: { shape: 'tomato', tone: 'chili' } },
    { id: 'cucumber', label: 'Cucumber', price: 40, max: 1, icon: { shape: 'cucumber', tone: 'pickle' } },
    { id: 'jalapeno', label: 'Jalapeños', price: 60, max: 1, icon: { shape: 'rings', tone: 'pickle' } },
    { id: 'pickled', label: 'Pickled onions', price: 50, max: 1, icon: { shape: 'rings', tone: 'chili' } },
  ] satisfies BuilderChoice<WrapVeggieId>[],
  sauces: [
    { id: 'garlic', label: 'Garlic mayo', price: 50, icon: { shape: 'drop', tone: 'oat' } },
    { id: 'mint', label: 'Mint chutney', price: 40, icon: { shape: 'drop', tone: 'pickle' } },
    { id: 'chipotle', label: 'Chipotle', price: 60, icon: { shape: 'drop', tone: 'chili' } },
    { id: 'imli', label: 'Imli', price: 40, icon: { shape: 'drop', tone: 'caramel' } },
    { id: 'house', label: 'House sauce', price: 50, icon: { shape: 'drop', tone: 'bubblegum' } },
  ] satisfies BuilderChoice<WrapSauceId>[],
  spice: [
    { id: 'mild', label: 'Mild', price: 0, icon: { shape: 'chili', tone: 'pickle', n: 1 } },
    { id: 'medium', label: 'Medium', price: 0, icon: { shape: 'chili', tone: 'cheese', n: 2 } },
    { id: 'desi-hot', label: 'Desi Hot 🌶️', price: 0, icon: { shape: 'chili', tone: 'chili', n: 3 } },
  ] satisfies BuilderChoice<SpiceLevel>[],
} as const

export const WRAP_DEFAULTS: WrapChoice = { base: 'tortilla', protein: 'tikka', double: false, cheeses: [], veggies: [], sauces: [], spice: 'medium' }
