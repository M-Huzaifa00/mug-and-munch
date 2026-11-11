import { HERO_PHOTO } from '@/data/heroPhoto'

/**
 * Warm golden-hour colour wash behind the whole hero: the photo's own colours, pre-blurred (a 160px image, <1 KB,
 * upscaled → no live CSS blur cost on phones). Clean oat behind the headline at the top, warming toward the
 * cinema panel below. Sits at -z-10 inside the section's isolated stacking context: under the grain and content.
 */
export function HeroBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <img src={HERO_PHOTO.blur} alt="" decoding="async" className="absolute inset-0 size-full scale-110 object-cover opacity-80" />
      <span className="absolute inset-0 bg-linear-to-b from-oat via-oat/85 via-40% to-oat/20" />
    </div>
  )
}
