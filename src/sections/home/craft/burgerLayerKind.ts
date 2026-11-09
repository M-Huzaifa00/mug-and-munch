import type { BurgerLayerId } from '@/data/builder'

/** A burger maker layer: any ingredient, or the bottom bun (always present). */
export type LayerKind = BurgerLayerId | 'bottom'

/** viewBox height per layer (width is always 240). */
export const LAYER_HEIGHT: Record<LayerKind, number> = { bottom: 50, patty: 40, cheese: 32, jalapeno: 26, sauce: 22, lettuce: 30, onion: 24, bun: 88 }
