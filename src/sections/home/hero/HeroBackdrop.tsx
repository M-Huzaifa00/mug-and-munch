import { useRef } from 'react'
import { HERO_PHOTO } from '@/data/heroPhoto'
import { gsap, MQ, refreshScrollTriggersSoon, useGSAP } from '@/lib/gsap'
import { DUR, EASE } from '@/lib/motion-presets'
import { HERO_ALT, HERO_FALLBACK_SRC, heroSrcSet } from './heroPhotoSrc'

/**
 * Hero banner (site.heroPhotoStyle = 'banner', the default): the golden-hour photo as a soft, low-opacity
 * backdrop, multiplied into the oat so it reads like a warm print under the page, with the section grain on top.
 * - Phones: the whole scene sits at the bottom of the hero (cup + box + mosque in view) and fades up into oat,
 *   behind the empty visual area under the buttons → never behind text.
 * - ≥768px: fills the hero; an oat fade on the left keeps the headline crisp, the products show on the right.
 * Motion: slow settle-in zoom on reveal + gentle scroll drift (transform only). Opacity lives on the wrappers
 * (CSS), GSAP only touches the <img> (scale / y / autoAlpha for the fade-in).
 */
export function HeroBackdrop({ play }: { play: boolean }) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MQ.motionOk, () => {
        const img = '[data-backdrop-img]'
        gsap.set(img, { scale: 1.06 })
        if (play) gsap.from(img, { scale: 1.16, autoAlpha: 0, duration: DUR.hero * 1.8, ease: EASE.out })
        gsap.to(img, { yPercent: 5, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true } })
      })
    },
    { scope: ref, dependencies: [play], revertOnUpdate: true },
  )

  return (
    // -z-10 inside the section's isolated stacking context: below the grain overlay (z -1) and all content.
    <div ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-x-0 bottom-0 h-[19rem] overflow-hidden opacity-60 mix-blend-multiply sm:h-[26rem] md:inset-y-0 md:h-auto md:opacity-45">
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
            className="h-full w-full object-cover object-[50%_60%] md:object-[72%_55%]"
          />
        </picture>
      </div>
      {/* Phones: oat fades down into the photo (top of the photo strip). */}
      <span className="absolute inset-x-0 bottom-[11rem] h-36 bg-linear-to-b from-oat via-oat via-30% to-oat/0 sm:bottom-[17rem] md:hidden" />
      {/* Desktop: oat behind the headline, clearing toward the products; soft top edge under the navbar. */}
      <span className="absolute inset-0 hidden bg-linear-to-r from-oat via-oat/85 via-40% to-oat/0 to-75% md:block" />
      <span className="absolute inset-x-0 top-0 hidden h-40 bg-linear-to-b from-oat to-oat/0 md:block" />
      {/* Warm vignette at the bottom edge, leading into the espresso marquee. */}
      <span className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-caramel/20 to-transparent" />
    </div>
  )
}
