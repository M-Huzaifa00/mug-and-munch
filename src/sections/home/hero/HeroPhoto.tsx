import { HERO_PHOTO } from '@/data/heroPhoto'
import { refreshScrollTriggersSoon } from '@/lib/gsap'
import { HERO_ALT, HERO_FALLBACK_SRC, heroSrcSet } from './heroPhotoSrc'

// Phones: ~88vw. Tablet/desktop: the right grid column, capped by the 560px visual box.
const SIZES = '(min-width: 768px) min(40vw, 560px), 88vw'

/**
 * The hero "postcard" (site.heroPhotoStyle = 'postcard'): owner photo printed with an oat border, framed like a
 * sticker, taped on, with a handwritten caption. Static markup only; HeroVisuals animates the data-photo-* parts.
 */
export function HeroPhoto() {
  return (
    <figure className="relative h-full w-full -rotate-2">
      <div data-photo-card className="sticker h-full w-full overflow-hidden rounded-[1.75rem] bg-oat p-1.5 sm:p-2">
        <div className="relative h-full w-full overflow-hidden rounded-[1.25rem] bg-caramel/30">
          <picture>
            <source type="image/avif" srcSet={heroSrcSet('avif')} sizes={SIZES} />
            <source type="image/webp" srcSet={heroSrcSet('webp')} sizes={SIZES} />
            <img
              data-photo-img
              src={HERO_FALLBACK_SRC}
              width={HERO_PHOTO.width}
              height={HERO_PHOTO.height}
              alt={HERO_ALT}
              fetchPriority="high"
              decoding="async"
              onLoad={() => refreshScrollTriggersSoon()}
              className="h-full w-full object-cover"
            />
          </picture>
          {/* Warm sunset wash at the bottom edge so the photo melts into the oat page instead of sitting on it. */}
          <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-caramel/25 to-transparent" />
        </div>
      </div>
      <span
        data-photo-tape
        aria-hidden="true"
        className="absolute -top-3 left-1/2 h-7 w-24 -translate-x-1/2 rotate-[-4deg] rounded-sm border border-espresso/10 bg-cheese/60 sm:w-28"
      />
      <figcaption
        data-photo-tag
        className="sticker absolute -bottom-4 left-[8%] rotate-[-3deg] rounded-full bg-oat px-3 py-0.5 font-hand text-lg whitespace-nowrap text-ink sm:text-xl"
      >
        golden hour, Islamabad 🌄
      </figcaption>
    </figure>
  )
}
