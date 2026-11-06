import { Fragment, useRef } from 'react'
import { getBestsellers } from '@/data/menu'
import { isLowEndDevice } from '@/hooks/useIsTouch'
import { gsap, MQ, ScrollTrigger, useGSAP } from '@/lib/gsap'
import { cn } from '@/lib/utils'
import { BrandImage } from '@/components/brand/BrandImage'

const URDU_LINES = ['Bhook lagi? 😋', 'Yaar, ek aur?', 'Order karo, chill karo ✌️', 'Garma garam 🔥', 'Late-night munchies 🌙']
const ITEM_LINE = getBestsellers().map((i) => `${i.name} ${i.emoji}`)
const BASE_SPEED = 32 // seconds per loop

const STRIPS = [
  { words: ITEM_LINE, bg: 'bg-chili', text: 'text-oat', tilt: '-rotate-2', reverse: false },
  { words: URDU_LINES, bg: 'bg-cheese', text: 'text-espresso', tilt: 'rotate-[1.5deg]', reverse: true },
] as const

/**
 * Two tilted infinite strips moving in opposite directions. Each track = 2 identical halves →
 * animating xPercent 0 → -50 loops seamlessly. Speed & direction follow scroll velocity; hover eases to a stop.
 */
export function Marquee() {
  const ref = useRef<HTMLElement>(null)
  // Low-end: shorter tracks (fewer DOM nodes); content still covers wide screens.
  const reps = isLowEndDevice() ? 2 : 3

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MQ.motionOk, () => {
        const tweens = gsap.utils.toArray<HTMLElement>('[data-track]').map((track) =>
          track.dataset.reverse === 'true'
            ? gsap.fromTo(track, { xPercent: -50 }, { xPercent: 0, duration: BASE_SPEED, ease: 'none', repeat: -1 })
            : gsap.to(track, { xPercent: -50, duration: BASE_SPEED, ease: 'none', repeat: -1 }),
        )
        let direction = 1
        let hovering = false
        const settle = () => gsap.to(tweens, { timeScale: hovering ? 0 : direction, duration: 0.8, ease: 'power2.out', overwrite: true })

        ScrollTrigger.create({
          trigger: ref.current,
          start: 'top bottom',
          end: 'bottom top',
          onUpdate: (self) => {
            direction = self.direction
            if (hovering) return
            const boost = 1 + Math.min(4, Math.abs(self.getVelocity()) / 500)
            gsap.to(tweens, { timeScale: direction * boost, duration: 0.2, overwrite: true, onComplete: settle })
          },
        })

        const el = ref.current
        const enter = () => {
          hovering = true
          settle()
        }
        const leave = () => {
          hovering = false
          settle()
        }
        el?.addEventListener('pointerenter', enter)
        el?.addEventListener('pointerleave', leave)
        return () => {
          el?.removeEventListener('pointerenter', enter)
          el?.removeEventListener('pointerleave', leave)
        }
      })
    },
    { scope: ref },
  )

  return (
    <section ref={ref} data-munch-hop aria-label="What we're about" className="relative overflow-hidden bg-espresso py-14 md:py-20">
      <p className="sr-only">{[...ITEM_LINE, ...URDU_LINES].join(' · ')}</p>
      {STRIPS.map((strip, s) => (
        <div
          key={s}
          aria-hidden="true"
          className={cn('-mx-[5%] border-y-[2.5px] border-espresso py-3 shadow-hard md:py-4', strip.bg, strip.tilt, s === 1 && '-mt-2')}
        >
          <div data-track data-reverse={strip.reverse} className="flex w-max will-change-transform">
            {[0, 1].map((half) => (
              <div key={half} className="flex shrink-0 items-center">
                {Array.from({ length: reps }).flatMap((_, r) =>
                  strip.words.map((word, i) => (
                    <Fragment key={`${r}-${i}`}>
                      <span className={cn('px-5 font-display text-3xl font-extrabold tracking-tight whitespace-nowrap uppercase md:text-5xl', strip.text)}>
                        {word}
                      </span>
                      <span className="flex size-11 shrink-0 items-center justify-center rounded-full border-2 border-espresso bg-oat md:size-14">
                        <BrandImage kind="icon" height={30} alt="" />
                      </span>
                    </Fragment>
                  )),
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}
