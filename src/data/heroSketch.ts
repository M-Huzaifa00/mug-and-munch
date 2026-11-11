/**
 * Which REAL menu items the hero sketch points at (the drawing's cup / burger / wrap + their hand-written notes).
 * Swap the slugs when prices arrive (e.g. a priced burger); notes show the price or "Price coming soon".
 */
export const SKETCH_ITEMS = {
  cup: 'spanish-latte',
  burger: 'smash-beast',
  wrap: 'jalapeno-jolt',
} as const

export type SketchPart = keyof typeof SKETCH_ITEMS
