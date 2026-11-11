import { Link } from 'react-router'
import { HERO_PHOTO } from '@/data/heroPhoto'
import { refreshScrollTriggersSoon } from '@/lib/gsap'
import { formatPKR } from '@/lib/utils'
import { menuCategoryHref } from '@/components/menu/menuIds'
import { OpenBadge } from '@/components/ui/OpenBadge'
import { COFFEE_FROM, HERO_ALT, HERO_FALLBACK_SRC, heroSrcSet } from './heroPhotoSrc'

// Phones: ~92vw. Tablet/desktop: the right grid column, capped by the 640px visual box.
const SIZES = '(min-width: 768px) min(46vw, 640px), 92vw'

/**
 * The hero "window": the golden-hour photo at full colour in a big sticker card (espresso border, chili offset
 * shadow), with honest chips on top: live open/closed badge, the caption, and "Coffee from Rs X" (cheapest real
 * coffee, links to the menu). Static markup; HeroVisuals animates [data-photo-card] / [data-photo-img] / [data-chip].
 */
export function HeroPhoto() {
  return (
    <figure className="relative h-full w-full">
      <div
        data-photo-card
        className="relative h-full w-full overflow-hidden rounded-[2rem] border-[3px] border-espresso bg-caramel/30 shadow-[6px_6px_0_0_var(--color-chili)] sm:rounded-[2.5rem] sm:shadow-[10px_10px_0_0_var(--color-chili)]"
      >
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
            className="h-full w-full object-cover object-[50%_55%]"
          />
        </picture>
        {/* Soft bottom shade so the caption chip always reads. */}
        <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-linear-to-t from-espresso/40 to-transparent" />
      </div>

      <div data-chip className="absolute top-3 left-3 sm:top-5 sm:left-5">
        <OpenBadge className="shadow-hard-sm" />
      </div>
      <figcaption data-chip className="absolute bottom-10 left-3 rounded-full bg-oat/90 px-3 py-0.5 font-hand text-lg whitespace-nowrap text-ink sm:bottom-12 sm:left-5 sm:text-xl">
        golden hour, Islamabad 🌄
      </figcaption>
      {COFFEE_FROM !== null && (
        // Wrapper takes the GSAP pop; the link keeps its CSS tilt + hover lift (never both on one element).
        <div data-chip className="absolute -bottom-5 left-4 sm:left-6">
          <Link
            to={menuCategoryHref('coffee')}
            className="sticker inline-flex min-h-11 rotate-[3deg] items-center rounded-full bg-cheese px-4 font-display text-sm font-extrabold whitespace-nowrap text-espresso transition-[translate] hover:-translate-y-0.5 sm:text-base"
          >
            ☕ Coffee from {formatPKR(COFFEE_FROM)}
          </Link>
        </div>
      )}
    </figure>
  )
}
