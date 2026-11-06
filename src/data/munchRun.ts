/**
 * Munch Run: the decorative snack that travels Hero → MenuPreview → Bestsellers, changing form.
 * Tweak stops, offsets, sizes and thresholds here; components read everything from this file.
 * Anchor classes are Tailwind classes on an invisible <span data-munch-stop> inside each section.
 */

export type MunchForm = 'burger' | 'wrap' | 'coffee'
export type MunchStopId = 1 | 2 | 3

export interface MunchStopConfig {
  stop: MunchStopId
  section: 'hero' | 'menuPreview' | 'bestsellers'
  corner: 'top-right' | 'top-left'
  form: MunchForm
  note: string
  craftHash: `#craft-${MunchForm}`
  /** Where the note sits relative to the parked character. */
  noteSide: 'left' | 'right'
  /** Position of the anchor inside its section, per breakpoint (mobile first). */
  anchorClass: string
}

/** Character box: ~60px phones, ~88px tablets, ~110px ≥1024px. Anchor + traveler share it. */
export const MUNCH_SIZE_CLASS = 'size-[60px] md:size-[88px] lg:size-[110px]'

export const MUNCH_STOPS: readonly MunchStopConfig[] = [
  {
    stop: 1,
    section: 'hero',
    corner: 'top-right',
    form: 'burger',
    note: 'follow me 👇',
    craftHash: '#craft-burger',
    noteSide: 'left',
    // Inside HeroVisuals (top-right of the floating items), where the old floating burger area was.
    anchorClass: 'top-[1%] right-[3%] md:top-[0%] md:right-[2%]',
  },
  {
    stop: 2,
    section: 'menuPreview',
    corner: 'top-left',
    form: 'wrap',
    note: 'plot twist 🌯',
    craftHash: '#craft-wrap',
    noteSide: 'right',
    // In the section's top padding, left edge of the content column (never over the heading or tabs).
    anchorClass: 'top-3 left-4 sm:left-6 md:top-4 lg:left-[max(1.5rem,calc(50%-38.5rem))]',
  },
  {
    stop: 3,
    section: 'bestsellers',
    corner: 'top-right',
    form: 'coffee',
    note: 'chai? nahi, coffee ☕',
    craftHash: '#craft-coffee',
    noteSide: 'left',
    // Mobile: top padding above the heading. Desktop: beside the heading row (lands before the pin starts).
    anchorClass: 'top-3 right-4 sm:right-6 md:top-4 lg:top-20 lg:right-[max(1.5rem,calc(50%-38.5rem))]',
  },
] as const

export const MUNCH_RUN_CONFIG = {
  /** Flight line as a fraction of viewport height: a segment starts/ends when an anchor's top crosses it. */
  flightLine: { desktop: 0.28, mobile: 0.22 },
  /** Below this width: smaller arcs, wobble instead of spin, fewer crumbs, notes hidden. */
  mobileMax: 767,
  /** Notes only where they fit beside the character without covering text. */
  notesMinWidth: 768,
  /** Curve shape: pull toward the page centre (fraction of the gap) + drop (fraction of viewport height). */
  arc: { pull: { desktop: 0.55, mobile: 0.35 }, drop: { desktop: 0.12, mobile: 0.06 } },
  /** Hop over the tilted marquee strip during segment 1 (fraction of viewport height, progress window). */
  marqueeHop: { height: 0.09, from: 0.12, to: 0.48 },
  crumbs: { desktop: 8, mobile: 4, everyPx: 38 },
  /** Lenis velocity (px/frame) that makes it dizzy during flight. */
  dizzyVelocity: 55,
  /** Cores at or below this → low-end path (no crumbs, sparkles, dizzy eyes or Munchy look-at). */
  lowEndCores: 4,
} as const
