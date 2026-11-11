import { HERO_PHOTO } from '@/data/heroPhoto'
import { cn } from '@/lib/utils'

/** Where each capsule zooms into the golden-hour photo (transform-origin = the subject). */
const CROPS = {
  cup: 'origin-[2%_46%] scale-[2.6] group-hover:scale-[2.9]',
  box: 'origin-[65%_57%] scale-[1.9] group-hover:scale-[2.2]',
} as const

const srcSet = (ext: 'avif' | 'webp') => HERO_PHOTO.widths.slice(0, 2).map((w) => `${HERO_PHOTO.base}-${w}.${ext} ${w}w`).join(', ')

/**
 * A pill-shaped window into the hero photo that sits INSIDE the headline (sized in em, so it scales with the
 * type): "SIP. (frappe) BITE. (burger box) REPEAT.". Decorative (aria-hidden). GSAP grows the capsule
 * ([data-capsule], scaleX) on intro; the image zoom + hover zoom are CSS on the <img> only.
 */
export function HeroCapsule({ crop }: { crop: keyof typeof CROPS }) {
  return (
    <span
      data-capsule
      aria-hidden="true"
      style={{ transformOrigin: 'left center' }}
      className="group relative mx-[0.08em] inline-block h-[0.7em] w-[1.4em] overflow-hidden rounded-full border-[0.045em] border-espresso bg-caramel/40 align-[0.04em] shadow-hard-sm"
    >
      <picture>
        <source type="image/avif" srcSet={srcSet('avif')} sizes="(min-width: 768px) 220px, 110px" />
        <source type="image/webp" srcSet={srcSet('webp')} sizes="(min-width: 768px) 220px, 110px" />
        <img
          src={`${HERO_PHOTO.base}-${HERO_PHOTO.widths[0]}.webp`}
          alt=""
          decoding="async"
          className={cn('size-full object-cover transition-[scale] duration-700 ease-snappy', CROPS[crop])}
        />
      </picture>
    </span>
  )
}
