import { HERO_PHOTO } from '@/data/heroPhoto'

/**
 * Warm golden-hour colour wash behind the whole hero: the photo's own colours, pre-blurred (a 160px image, ~1 KB,
 * upscaled → no live CSS blur cost on phones). Oat fades keep the text side clean; the photo window is the star.
 * Sits at -z-10 inside the section's isolated stacking context: under the grain overlay and all content.
 */
export function HeroBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <img src={HERO_PHOTO.blur} alt="" decoding="async" className="absolute inset-0 size-full scale-110 object-cover opacity-80" />
      {/* Phones: clean oat behind the text at the top, warming toward the photo below. */}
      <span className="absolute inset-0 bg-linear-to-b from-oat via-oat/75 via-45% to-oat/10 md:hidden" />
      {/* Desktop: clean oat behind the headline (left), golden glow around the photo (right). */}
      <span className="absolute inset-0 hidden bg-linear-to-r from-oat via-oat/80 via-40% to-oat/5 md:block" />
      <span className="absolute inset-x-0 top-0 hidden h-32 bg-linear-to-b from-oat/90 to-transparent md:block" />
    </div>
  )
}
