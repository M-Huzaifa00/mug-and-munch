import { useRef } from 'react'
import { gsap, MQ, useGSAP } from '@/lib/gsap'
import { DUR, EASE } from '@/lib/motion-presets'
import { LogoStamp } from '@/components/brand/LogoStamp'
import { MunchStop } from '@/components/munchRun/MunchStop'
import { HeroPhoto } from './HeroPhoto'

/**
 * Hero visual: the golden-hour postcard photo + logo stamp (the burger is the Munch Run traveler, perched on
 * the postcard's top edge via its anchor). Motion (only with motion OK):
 * - intro: postcard drops in with a bouncy tilt while the photo settles from a zoom; tape + caption pop after.
 * - scroll: the photo drifts inside its frame (one composited transform, scrubbed) for depth.
 * - idle: gentle float; fine pointers also get 2-layer mouse parallax.
 */
export function HeroVisuals({ play, framed = true }: { play: boolean; framed?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add({ motion: MQ.motionOk, fine: MQ.finePointer }, (ctx) => {
        const { motion, fine } = ctx.conditions as { motion: boolean; fine: boolean }
        if (!motion) return
        if (play) gsap.from('[data-stamp]', { scale: 0.4, rotation: -60, autoAlpha: 0, duration: DUR.slow, ease: EASE.bouncy, delay: 0.25 + DUR.base })
        if (framed) {
          const img = '[data-photo-img]'
          gsap.set(img, { scale: 1.1 })
          if (play) {
            gsap
              .timeline({ delay: 0.25 })
              .from('[data-photo-card]', { yPercent: 14, rotation: -7, scale: 0.86, autoAlpha: 0, duration: DUR.slow, ease: EASE.bouncy })
              .from(img, { scale: 1.3, duration: DUR.hero * 1.6, ease: EASE.out }, 0)
              .from('[data-photo-tape]', { scale: 0, autoAlpha: 0, duration: DUR.fast, ease: EASE.bouncy }, DUR.base)
              .from('[data-photo-tag]', { y: 14, autoAlpha: 0, duration: DUR.base, ease: EASE.bouncy }, DUR.base + 0.1)
          }
          gsap.fromTo(
            img,
            { yPercent: -4 },
            { yPercent: 4, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: true } },
          )
          gsap.to('[data-float]', { y: fine ? -12 : -6, rotation: 1, duration: 3, ease: 'sine.inOut', yoyo: true, repeat: -1 })
        }
        if (!fine) return
        const movers = gsap.utils.toArray<HTMLElement>('[data-depth]').map((el) => ({
          depth: Number(el.dataset.depth),
          x: gsap.quickTo(el, 'x', { duration: 0.8, ease: EASE.out }),
          y: gsap.quickTo(el, 'y', { duration: 0.8, ease: EASE.out }),
        }))
        const onMove = (e: PointerEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5
          const ny = e.clientY / window.innerHeight - 0.5
          for (const m of movers) {
            m.x(nx * 30 * m.depth)
            m.y(ny * 22 * m.depth)
          }
        }
        window.addEventListener('pointermove', onMove, { passive: true })
        return () => window.removeEventListener('pointermove', onMove)
      })
    },
    { scope: ref, dependencies: [play, framed], revertOnUpdate: true },
  )

  return (
    <div ref={ref} className="relative mx-auto aspect-[4/3] w-full max-w-[min(88vw,560px)]">
      {/* Banner style: the photo is the hero background, so this box only keeps the Munch Run anchor + stamp. */}
      {framed && (
        <>
          <span aria-hidden="true" className="absolute inset-[6%] rounded-full bg-cheese/50 blur-3xl" />
          <div data-depth="0.4" className="absolute inset-0">
            <div data-float className="h-full w-full">
              <HeroPhoto />
            </div>
          </div>
        </>
      )}
      <MunchStop stop={1} />
      <div data-depth="1" aria-hidden="true" className="absolute -top-[9%] -left-[5%] hidden md:block">
        <div data-stamp>
          <LogoStamp size={104} className="-rotate-12" />
        </div>
      </div>
    </div>
  )
}
