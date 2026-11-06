import { useRef } from 'react'
import type { Review } from '@/data/reviews'
import { Draggable, gsap, MQ, useGSAP } from '@/lib/gsap'
import { cn } from '@/lib/utils'

const SPOTS = [
  { pos: 'left-[2%] top-[2%]', rot: -7, bg: 'bg-oat' },
  { pos: 'left-[30%] top-[14%]', rot: 5, bg: 'bg-cheese' },
  { pos: 'right-[3%] top-[0%]', rot: -4, bg: 'bg-pickle' },
  { pos: 'left-[6%] bottom-[4%]', rot: 4, bg: 'bg-bubblegum' },
  { pos: 'left-[38%] bottom-[0%]', rot: -5, bg: 'bg-caramel' },
  { pos: 'right-[2%] bottom-[8%]', rot: 7, bg: 'bg-oat' },
] as const

const stars = (n: number) => '★'.repeat(n) + '☆'.repeat(5 - n)

/**
 * Review stickers you can grab and toss (Draggable + InertiaPlugin), bounded to the board.
 * Touch devices drag horizontally only, so vertical page scrolling keeps working over the cards.
 */
export function ReviewsBoard({ reviews }: { reviews: Review[] }) {
  const board = useRef<HTMLDivElement>(null)
  const hint = useRef<HTMLSpanElement>(null)

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>('[data-review]')
      cards.forEach((card, i) => gsap.set(card, { rotation: SPOTS[i % SPOTS.length]?.rot ?? 0 }))
      const fine = window.matchMedia(MQ.finePointer).matches
      const motionOk = window.matchMedia(MQ.motionOk).matches
      const stack = { z: 10 }
      const draggables = Draggable.create(cards, {
        type: fine ? 'x,y' : 'x',
        bounds: board.current,
        inertia: motionOk,
        edgeResistance: 0.75,
        zIndexBoost: false,
        onPress(this: Draggable) {
          stack.z += 1
          gsap.set(this.target, { zIndex: stack.z })
        },
        onDragStart(this: Draggable) {
          if (motionOk) gsap.to(this.target, { scale: 1.06, duration: 0.2 })
        },
        onRelease(this: Draggable) {
          gsap.to(this.target, { scale: 1, duration: 0.3 })
        },
      })

      // "Drag" bubble that follows the cursor over the board (desktop only).
      if (!fine || !hint.current || !board.current) return () => draggables.forEach((d) => d.kill())
      const el = board.current
      gsap.set(hint.current, { autoAlpha: 0, scale: 0.6 })
      const xTo = gsap.quickTo(hint.current, 'x', { duration: 0.3 })
      const yTo = gsap.quickTo(hint.current, 'y', { duration: 0.3 })
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect()
        xTo(e.clientX - r.left + 14)
        yTo(e.clientY - r.top + 14)
      }
      // The global custom cursor already shows a "Drag" bubble when it's active → don't double up.
      const show = () => {
        if (document.documentElement.dataset.customCursor === 'on') return
        gsap.to(hint.current, { autoAlpha: 1, scale: 1, duration: 0.2 })
      }
      const hide = () => gsap.to(hint.current, { autoAlpha: 0, scale: 0.6, duration: 0.2 })
      el.addEventListener('pointermove', move)
      el.addEventListener('pointerenter', show)
      el.addEventListener('pointerleave', hide)
      return () => {
        draggables.forEach((d) => d.kill())
        el.removeEventListener('pointermove', move)
        el.removeEventListener('pointerenter', show)
        el.removeEventListener('pointerleave', hide)
      }
    },
    { scope: board, dependencies: [reviews.length] },
  )

  return (
    <div ref={board} className="relative h-[620px] touch-pan-y sm:h-[520px] md:h-[440px]">
      <span
        ref={hint}
        aria-hidden="true"
        className="pointer-events-none invisible absolute top-0 left-0 z-[60] rounded-full bg-chili px-3 py-1 font-display text-sm font-extrabold text-espresso opacity-0"
      >
        Drag ✋
      </span>
      {reviews.slice(0, SPOTS.length).map((r, i) => {
        const spot = SPOTS[i % SPOTS.length]
        return (
          <article
            key={r.id}
            data-review
            data-cursor="drag"
            className={cn(
              'sticker absolute w-[min(78vw,280px)] cursor-grab rounded-3xl p-4 text-espresso select-none active:cursor-grabbing',
              spot?.pos,
              spot?.bg,
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-3xl" aria-hidden="true">
                {r.emoji}
              </span>
              <span className="text-sm tracking-widest" aria-label={`${r.rating} out of 5 stars`}>
                {stars(r.rating)}
              </span>
            </div>
            <p className="mt-2 font-semibold">“{r.text}”</p>
            <p className="mt-3 font-hand text-2xl">
              {r.name}, {r.area}
            </p>
            {r.isPlaceholder && (
              <span className="absolute -top-3 right-4 rounded-full border-2 border-espresso bg-oat px-2 text-[0.6875rem] font-extrabold uppercase">
                sample
              </span>
            )}
          </article>
        )
      })}
    </div>
  )
}
