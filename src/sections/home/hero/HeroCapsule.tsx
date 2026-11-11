import { HERO_PHOTO } from '@/data/heroPhoto'
import { cn } from '@/lib/utils'

/**
 * Frames of the photo reel: transform-origin = the subject, scale = how close. 4th frame repeats the 1st so the
 * loop is seamless (HeroHeadline slides the track up a frame at a time, then snaps back to 0).
 */
const FRAMES = [
  'origin-[2%_46%] scale-[2.6]', // frappe
  'origin-[92%_22%] scale-[2.3]', // Faisal Mosque + hills
  'origin-[65%_57%] scale-[1.9]', // burger box
  'origin-[2%_46%] scale-[2.6]', // frappe again (loop seam)
] as const
export const REEL_FRAMES = FRAMES.length

/** Real menu words for the ticker pill (decorative, aria-hidden). */
const TICKER = ['ZINGER', 'SMASH', 'WRAPS', 'STEAK', 'MATCHA', 'MOJITOS']

const srcSet = (ext: 'avif' | 'webp') => HERO_PHOTO.widths.slice(0, 2).map((w) => `${HERO_PHOTO.base}-${w}.${ext} ${w}w`).join(', ')
/** Pill shell shared by both pills: sized in em so it scales with the headline type. */
const SHELL =
  'relative mx-[0.08em] inline-block h-[0.7em] w-[1.4em] overflow-hidden rounded-full border-[0.045em] border-espresso align-[0.04em] shadow-hard-sm'

/**
 * Photo reel pill after "SIP.": a tiny film strip cycling frappe → mosque hills → burger box.
 * GSAP: [data-capsule] grows open (scaleX) on intro; [data-reel] steps through the frames (yPercent).
 */
export function HeroReelPill() {
  return (
    <span data-capsule aria-hidden="true" style={{ transformOrigin: 'left center' }} className={cn(SHELL, 'bg-caramel/40')}>
      <span data-reel className="absolute inset-x-0 top-0 block" style={{ height: `${REEL_FRAMES * 100}%` }}>
        {FRAMES.map((zoom, i) => (
          <span key={i} className="block overflow-hidden" style={{ height: `${100 / REEL_FRAMES}%` }}>
            <picture>
              <source type="image/avif" srcSet={srcSet('avif')} sizes="(min-width: 768px) 220px, 110px" />
              <source type="image/webp" srcSet={srcSet('webp')} sizes="(min-width: 768px) 220px, 110px" />
              <img src={`${HERO_PHOTO.base}-${HERO_PHOTO.widths[0]}.webp`} alt="" decoding="async" className={cn('size-full object-cover', zoom)} />
            </picture>
          </span>
        ))}
      </span>
    </span>
  )
}

/**
 * Ticker pill after "BITE.": a cheese capsule with the real menu words scrolling through it (two identical halves
 * → GSAP loops [data-ticker] xPercent 0 → -50 seamlessly). Espresso text on cheese (AA at every size).
 */
export function HeroTickerPill() {
  const half = (
    <span className="flex shrink-0 items-center">
      {TICKER.map((w) => (
        <span key={w} className="flex items-center">
          <span className="px-[0.35em]">{w}</span>
          <span className="text-chili">✦</span>
        </span>
      ))}
    </span>
  )
  return (
    <span data-capsule aria-hidden="true" style={{ transformOrigin: 'left center' }} className={cn(SHELL, 'bg-cheese')}>
      <span className="absolute inset-0 flex items-center font-sans text-[0.24em] font-extrabold tracking-[0.08em] text-espresso">
        <span data-ticker className="flex w-max">
          {half}
          {half}
        </span>
      </span>
    </span>
  )
}
