import { useRef } from 'react'
import { gsap, MQ, useGSAP } from '@/lib/gsap'
import { DUR, EASE } from '@/lib/motion-presets'
import { LogoStamp } from '@/components/brand/LogoStamp'
import { MunchStop } from '@/components/munchRun/MunchStop'
import { HeroPhoto } from './HeroPhoto'

/**
 * Hero visual: the golden-hour photo window + logo stamp (the burger is the Munch Run traveler, perched on the
 * window's top edge via its anchor). Motion (only with motion OK):
 * - intro (when the preloader curtain lifts): window rises in with a bounce while the photo settles from a zoom,
 *   chips + stamp pop after.
 * - idle: very slow "breathing" zoom on the photo (Ken Burns), so the scene feels alive without distracting.
 * - scroll: the photo drifts inside its frame. Fine pointers: 2-layer mouse parallax (window, chips/stamp).
 */
export function HeroVisuals({ play }: { play: boolean }) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add({ motion: MQ.motionOk, fine: MQ.finePointer }, (ctx) => {
        const { motion, fine } = ctx.conditions as { motion: boolean; fine: boolean }
        if (!motion) return
        const img = '[data-photo-img]'
        gsap.set(img, { scale: 1.08 })
        const breathe = () => gsap.to(img, { scale: 1.14, duration: 9, ease: 'sine.inOut', yoyo: true, repeat: -1 })
        if (play) {
          gsap
            .timeline({ delay: 0.15, onComplete: breathe })
            .from('[data-photo-card]', { yPercent: 10, scale: 0.94, autoAlpha: 0, duration: DUR.slow, ease: EASE.bouncy })
            .from(img, { scale: 1.32, duration: DUR.hero * 1.5, ease: EASE.out }, 0)
            .from('[data-chip]', { y: 16, scale: 0.8, autoAlpha: 0, duration: DUR.base, ease: EASE.bouncy, stagger: 0.12 }, DUR.base)
            .from('[data-stamp]', { scale: 0.4, rotation: -60, autoAlpha: 0, duration: DUR.slow, ease: EASE.bouncy }, DUR.base)
        } else {
          breathe()
        }
        gsap.fromTo(img, { yPercent: -3 }, { yPercent: 3, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: true } })
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
            m.x(nx * 24 * m.depth)
            m.y(ny * 18 * m.depth)
          }
        }
        window.addEventListener('pointermove', onMove, { passive: true })
        return () => window.removeEventListener('pointermove', onMove)
      })
    },
    { scope: ref, dependencies: [play], revertOnUpdate: true },
  )

  return (
    <div ref={ref} className="relative mx-auto aspect-[4/3] w-full max-w-[min(92vw,640px)]">
      <span aria-hidden="true" className="absolute inset-[8%] rounded-full bg-cheese/40 blur-3xl" />
      <div data-depth="0.35" className="absolute inset-0">
        <HeroPhoto />
      </div>
      <MunchStop stop={1} />
      <div data-depth="1" aria-hidden="true" className="absolute -top-[13%] -left-[15%] hidden md:block">
        <div data-stamp>
          <LogoStamp size={104} className="-rotate-12" />
        </div>
      </div>
    </div>
  )
}
