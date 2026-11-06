/**
 * Shared layout classes for maker panels inside CraftSection's grid
 * (areas: mobile "stage / switch / controls"; md+ "switch switch / stage controls").
 * Mobile: the illustration stage is sticky (~40vh) while the tiles scroll underneath.
 */
export const MAKER_STAGE =
  'relative flex items-end justify-center [grid-area:stage] max-md:sticky max-md:top-16 max-md:z-10 max-md:h-[40vh] max-md:bg-espresso md:h-[440px]'
