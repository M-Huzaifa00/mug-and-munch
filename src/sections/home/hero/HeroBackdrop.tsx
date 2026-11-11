import { useRef } from 'react'
import { HERO_PHOTO } from '@/data/heroPhoto'
import { gsap, MQ, refreshScrollTriggersSoon, useGSAP } from '@/lib/gsap'
import { DUR, EASE } from '@/lib/motion-presets'
import { HERO_ALT, HERO_FALLBACK_SRC, heroSrcSet } from './heroPhotoSrc'

/**
 * Full-bleed banner (site.heroPhotoStyle = 'banner'): the photo is the hero background.
 * Phones: it sits in the lower part of the hero and fades up into oat, so the headline stays on a clean oat field.
 * ≥768px: it fills the hero; an oat fade on the left keeps the headline readable, the products show on the right.
 * Motion: slow settle-in zoom on reveal + gentle scroll drift (transform only).
 */
export function HeroBackdrop({ play }: { play: boolean }) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MQ.motionOk, () => {
        const img = '[data-backdrop-img]'
        gsap.set(img, { scale: 1.08 })
        if (play) gsap.from(img, { scale: 1.22, autoAlpha: 0, duration: DUR.hero * 1.6, ease: EASE.out })
        gsap.to(img, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true } })
      })
    },
    { scope: ref, dependencies: [play], revertOnUpdate: true },
  )

  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-x-0 bottom-0 h-[58%] md:inset-y-0 md:h-auto">
        <picture>
          <source type="image/avif" srcSet={heroSrcSet('avif')} sizes="100vw" />
          <source type="image/webp" srcSet={heroSrcSet('webp')} sizes="100vw" />
          <img
            data-backdrop-img
            src={HERO_FALLBACK_SRC}
            width={HERO_PHOTO.width}
            height={HERO_PHOTO.height}
            alt={HERO_ALT}
            fetchPriority="high"
            decoding="async"
            onLoad={() => refreshScrollTriggersSoon()}
            className="h-full w-full object-cover object-[50%_70%] md:object-[70%_60%]"
          />
        </picture>
      </div>
      {/* Phones: fade from oat (top) into the photo. Desktop: fade from oat (left, behind the text) to clear. */}
      <span className="absolute inset-x-0 bottom-[30%] h-[32%] bg-linear-to-b from-oat to-oat/0 md:hidden" />
      <span className="absolute inset-x-0 top-0 h-[42%] bg-oat md:hidden" />
      <span className="absolute inset-0 hidden bg-linear-to-r from-oat via-oat/80 to-oat/0 md:block md:via-35% md:to-65%" />
      <span className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-espresso/35 to-transparent" />
    </div>
  )
}
