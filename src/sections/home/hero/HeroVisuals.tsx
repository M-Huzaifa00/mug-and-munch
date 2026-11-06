import { useRef } from 'react'
import { getItemBySlug } from '@/data/menu'
import { gsap, MQ, useGSAP } from '@/lib/gsap'
import { DUR, EASE } from '@/lib/motion-presets'
import { cn } from '@/lib/utils'
import { LogoStamp } from '@/components/brand/LogoStamp'
import { ProductImage } from '@/components/ui/ProductImage'
import { MunchStop } from '@/components/munchRun/MunchStop'

const VISUALS = [
  // The burger is the Munch Run traveler (parks top-right of this box), so no burger photo here.
  { slug: 'spanish-latte', depth: 1, tag: 'iced latte 🧊', box: 'left-[4%] top-[18%] w-[54%]', tilt: -6, shape: 'rounded-[46%_54%_42%_58%/55%_45%_55%_45%]' },
  { slug: 'chicken-tikka-wrap', depth: 0.3, tag: 'tikka wrap', box: 'right-[6%] bottom-[2%] w-[42%]', tilt: -10, shape: 'rounded-[40%_60%_55%_45%/50%_40%_60%_50%]' },
] as const

/**
 * Floating hero items (latte + wrap + stamp; the burger is the Munch Run traveler) (real photos if present in public/images, else styled blobs).
 * 3 depth layers of mouse parallax on fine pointers; gentle idle float everywhere (smaller on touch).
 */
export function HeroVisuals({ play }: { play: boolean }) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add({ motion: MQ.motionOk, fine: MQ.finePointer }, (ctx) => {
        const { motion, fine } = ctx.conditions as { motion: boolean; fine: boolean }
        if (!motion) return
        const layers = gsap.utils.toArray<HTMLElement>('[data-depth]')
        if (play) gsap.from('[data-float] > div', { scale: 0.5, opacity: 0, duration: DUR.slow, ease: EASE.bouncy, stagger: 0.12, delay: 0.3 })
        gsap.utils.toArray<HTMLElement>('[data-float]').forEach((el, i) => {
          gsap.to(el, { y: fine ? -14 : -8, rotate: i % 2 ? 2 : -2, duration: 2.4 + i * 0.5, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: i * 0.3 })
        })
        if (!fine) return
        const movers = layers.map((el) => ({
          depth: Number(el.dataset.depth),
          x: gsap.quickTo(el, 'x', { duration: 0.8, ease: EASE.out }),
          y: gsap.quickTo(el, 'y', { duration: 0.8, ease: EASE.out }),
        }))
        const onMove = (e: PointerEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5
          const ny = e.clientY / window.innerHeight - 0.5
          for (const m of movers) {
            m.x(nx * 46 * m.depth)
            m.y(ny * 34 * m.depth)
          }
        }
        window.addEventListener('pointermove', onMove, { passive: true })
        return () => window.removeEventListener('pointermove', onMove)
      })
    },
    { scope: ref, dependencies: [play], revertOnUpdate: true },
  )

  return (
    <div ref={ref} className="relative mx-auto aspect-square w-full max-w-[min(88vw,560px)]" aria-hidden="true">
      <span className="absolute inset-[12%] rounded-full bg-cheese/50 blur-3xl" />
      <MunchStop stop={1} />
      {VISUALS.map((v) => {
        const item = getItemBySlug(v.slug)
        if (!item) return null
        return (
          <div key={v.slug} data-depth={v.depth} className={cn('absolute', v.box)}>
            <div data-float style={{ rotate: `${v.tilt}deg` }}>
              <div className={cn('sticker aspect-square overflow-hidden', v.shape)}>
                <ProductImage name={item.name} emoji={item.emoji} image={item.image} category={item.category} showName={false} priority={v.depth === 1} />
              </div>
              <span className="sticker absolute -bottom-3 left-1/2 -translate-x-1/2 -rotate-3 rounded-full bg-oat px-3 py-0.5 font-hand text-lg whitespace-nowrap text-ink sm:text-xl">
                {v.tag}
              </span>
            </div>
          </div>
        )
      })}
      <div data-depth="0.8" className="absolute bottom-[8%] left-[2%]">
        <LogoStamp size={112} className="-rotate-12" />
      </div>
    </div>
  )
}
