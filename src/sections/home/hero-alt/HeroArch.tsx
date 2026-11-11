import { Link } from 'react-router'
import { HERO_PHOTO } from '@/data/heroPhoto'
import { refreshScrollTriggersSoon } from '@/lib/gsap'
import { formatPKR } from '@/lib/utils'
import { LogoStamp } from '@/components/brand/LogoStamp'
import { menuCategoryHref } from '@/components/menu/menuIds'
import { COFFEE_FROM, HERO_ALT, HERO_FALLBACK_SRC, heroSrcSet } from '../hero/heroPhotoSrc'

const SIZES = '(min-width: 1024px) 40vw, 92vw'

/**
 * New-hero visual: ONE tall arch window holding the golden-hour photo at full colour (sticker border + hard
 * shadow), the logo stamp on its shoulder, a quiet caption and the honest "Coffee from Rs X" chip.
 * HeroAlt animates [data-arch] (clip-path wipe) and [data-arch-img] (zoom settle + scroll drift).
 */
export function HeroArch() {
  return (
    <div className="relative mx-auto w-full max-w-md lg:max-w-none">
      <div
        data-arch
        data-cursor="view"
        data-cursor-label="Golden hour ✨"
        className="relative aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-[2rem] border-[3px] border-espresso bg-caramel/30 shadow-hard-lg lg:aspect-[3/4]"
      >
        <picture>
          <source type="image/avif" srcSet={heroSrcSet('avif')} sizes={SIZES} />
          <source type="image/webp" srcSet={heroSrcSet('webp')} sizes={SIZES} />
          <img
            data-arch-img
            src={HERO_FALLBACK_SRC}
            width={HERO_PHOTO.width}
            height={HERO_PHOTO.height}
            alt={HERO_ALT}
            fetchPriority="high"
            decoding="async"
            onLoad={() => refreshScrollTriggersSoon()}
            className="size-full object-cover object-[30%_55%]"
          />
        </picture>
        <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-linear-to-t from-espresso/55 to-transparent" />
        <p aria-hidden="true" className="absolute bottom-6 left-6 font-hand text-3xl leading-none text-oat drop-shadow-[0_2px_0_var(--color-espresso)] sm:text-4xl">
          golden hour, Islamabad
        </p>
      </div>
      <div aria-hidden="true" className="absolute -top-4 -left-4 hidden sm:block">
        <LogoStamp size={104} className="-rotate-12" />
      </div>
      {COFFEE_FROM !== null && (
        <div className="absolute right-5 -bottom-5">
          <Link
            to={menuCategoryHref('coffee')}
            className="sticker inline-flex min-h-11 rotate-[3deg] items-center rounded-full bg-cheese px-4 font-display text-sm font-extrabold whitespace-nowrap text-espresso transition-[translate,rotate] hover:-translate-y-0.5 hover:rotate-0 sm:text-base"
          >
            ☕ Coffee from {formatPKR(COFFEE_FROM)} →
          </Link>
        </div>
      )}
    </div>
  )
}
