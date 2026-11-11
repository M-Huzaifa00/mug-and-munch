import { useRef } from 'react'
import { Link } from 'react-router'
import { HERO_PHOTO } from '@/data/heroPhoto'
import { gsap, MQ, refreshScrollTriggersSoon, useGSAP } from '@/lib/gsap'
import { DUR, EASE } from '@/lib/motion-presets'
import { formatPKR } from '@/lib/utils'
import { LogoStamp } from '@/components/brand/LogoStamp'
import { menuCategoryHref } from '@/components/menu/menuIds'
import { COFFEE_FROM, HERO_ALT, HERO_FALLBACK_SRC, heroSrcSet } from './heroPhotoSrc'

/**
 * The golden-hour "cinema": the photo at full colour in a wide sticker panel that peeks in under the headline,
 * then GROWS to full width as you scroll in (scale 0.86 → 1, transform only) while the photo zooms out
 * (1.25 → 1.02) and drifts. Big Caveat caption, honest "Coffee from Rs X" chip, spinning logo stamp.
 * Reduced motion: static, full size.
 */
export function HeroCinema({ play }: { play: boolean }) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add({ motion: MQ.motionOk, desktop: MQ.desktop }, (ctx) => {
        const { motion, desktop } = ctx.conditions as { motion: boolean; desktop: boolean }
        if (!motion) return
        const panel = '[data-cinema]'
        const img = '[data-cinema-img]'
        if (play) gsap.from(ref.current, { y: 80, autoAlpha: 0, duration: DUR.slow, ease: EASE.out, delay: 0.55 })
        const st = { trigger: ref.current, start: 'top bottom', end: 'top 20%', scrub: true }
        gsap.fromTo(panel, { scale: desktop ? 0.86 : 0.93 }, { scale: 1, ease: 'none', scrollTrigger: st })
        gsap.fromTo(img, { scale: 1.25 }, { scale: 1.02, ease: 'none', scrollTrigger: st })
        gsap.fromTo(img, { yPercent: -4 }, { yPercent: 4, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: true } })
      })
    },
    { scope: ref, dependencies: [play], revertOnUpdate: true },
  )

  return (
    <div ref={ref} className="relative mt-12 md:mt-16">
      <div
        data-cinema
        className="relative aspect-square w-full origin-top overflow-hidden rounded-[2rem] border-[3px] border-espresso bg-caramel/30 shadow-hard-lg sm:aspect-[4/3] md:aspect-auto md:h-[min(80vh,760px)] md:rounded-[3rem]"
      >
        <picture>
          <source type="image/avif" srcSet={heroSrcSet('avif')} sizes="100vw" />
          <source type="image/webp" srcSet={heroSrcSet('webp')} sizes="100vw" />
          <img
            data-cinema-img
            src={HERO_FALLBACK_SRC}
            width={HERO_PHOTO.width}
            height={HERO_PHOTO.height}
            alt={HERO_ALT}
            loading="lazy"
            decoding="async"
            onLoad={() => refreshScrollTriggersSoon()}
            className="h-full w-full object-cover object-[35%_55%] md:object-[50%_60%]"
          />
        </picture>
        <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-espresso/60 to-transparent" />
        <p className="absolute bottom-5 left-5 max-w-[75%] -rotate-2 font-hand text-4xl leading-none text-oat drop-shadow-[0_2px_0_var(--color-espresso)] sm:bottom-8 sm:left-8 sm:text-6xl md:text-7xl">
          golden hour, Islamabad 🌄
        </p>
        <div aria-hidden="true" className="absolute top-4 right-4 sm:top-6 sm:right-6">
          <LogoStamp size={92} className="rotate-12" />
        </div>
      </div>
      {COFFEE_FROM !== null && (
        <div className="absolute -bottom-6 left-6 sm:left-10">
          <Link
            to={menuCategoryHref('coffee')}
            className="sticker inline-flex min-h-12 -rotate-3 items-center rounded-full bg-cheese px-5 font-display text-base font-extrabold whitespace-nowrap text-espresso transition-[translate,rotate] hover:-translate-y-0.5 hover:rotate-0 sm:text-lg"
          >
            ☕ Coffee from {formatPKR(COFFEE_FROM)} →
          </Link>
        </div>
      )}
    </div>
  )
}
