import { useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { getItemBySlug, type MenuItem } from '@/data/menu'
import { VIBES } from '@/data/toys'
import { useAddToCart } from '@/hooks/useAddToCart'
import { Flip, MQ, useGSAP } from '@/lib/gsap'
import { FADE_UP, TOYS } from '@/lib/motion-presets'
import { toCartInput } from '@/lib/itemOptions'
import { cn, formatPKR } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { Chip } from '@/components/ui/Chip'
import { ProductCard } from '@/components/ui/ProductCard'
import { RevealHeading } from '@/components/ui/RevealHeading'

/** Every item any vibe can recommend, in first-seen order. */
const POOL: MenuItem[] = [...new Set(VIBES.flatMap((v) => v.picks))].map((id) => getItemBySlug(id)).filter((i): i is MenuItem => Boolean(i))

/** Mood chips → GSAP Flip reshuffles the grid so the vibe's 3 picks lead (highlighted, one-tap add). */
export function VibePicker() {
  const [vibeId, setVibeId] = useState<string | null>(null)
  const grid = useRef<HTMLUListElement>(null)
  const flipState = useRef<Flip.FlipState | null>(null)
  const addToCart = useAddToCart()
  const vibe = VIBES.find((v) => v.id === vibeId) ?? null

  const ordered = useMemo(() => {
    if (!vibe) return POOL
    const picks = vibe.picks.map((id) => POOL.find((i) => i.id === id)).filter((i): i is MenuItem => Boolean(i))
    return [...picks, ...POOL.filter((i) => !vibe.picks.includes(i.id))]
  }, [vibe])
  const picksTotal = ordered.slice(0, 3).reduce((s, i) => s + i.price, 0)

  const choose = (id: string) => {
    if (grid.current) flipState.current = Flip.getState(grid.current.querySelectorAll('[data-flip]'))
    setVibeId((prev) => (prev === id ? null : id))
  }

  // After React reorders the cards, animate them from their old positions.
  useGSAP(
    () => {
      const state = flipState.current
      flipState.current = null
      if (!state || !window.matchMedia(MQ.motionOk).matches) return
      Flip.from(state, { duration: TOYS.flip, ease: 'power2.inOut', stagger: 0.025, nested: true })
    },
    { dependencies: [vibeId], scope: grid },
  )

  const addAll = () => ordered.slice(0, 3).forEach((item) => addToCart(toCartInput(item)))

  return (
    <section aria-labelledby="vibe-title" className="grain relative overflow-hidden bg-oat px-4 py-20 sm:px-6 md:py-28">
      <div className="mx-auto max-w-6xl">
        <RevealHeading id="vibe-title" className="text-display font-extrabold text-espresso">
          What's your vibe?
        </RevealHeading>
        <div className="mt-1 h-10">
          <AnimatePresence mode="wait">
            <motion.p key={vibe?.id ?? 'none'} {...FADE_UP} className="-rotate-1 font-hand text-2xl text-ink sm:text-3xl">
              {vibe ? vibe.line : 'mood batao, food lo 👇'}
            </motion.p>
          </AnimatePresence>
        </div>

        <div role="group" aria-label="Pick a vibe" className="mt-6 flex flex-wrap gap-2 sm:gap-3">
          {VIBES.map((v) => (
            <Chip key={v.id} active={vibeId === v.id} activeBg="bg-cheese" activeText="text-espresso" layoutId="vibe-chip" onClick={() => choose(v.id)} className="min-h-12 px-5 text-base">
              {v.label} <span aria-hidden="true">{v.emoji}</span>
            </Chip>
          ))}
        </div>

        <p className="sr-only" aria-live="polite">
          {vibe ? `Picks for ${vibe.label}: ${ordered.slice(0, 3).map((i) => i.name).join(', ')}` : ''}
        </p>

        <ul ref={grid} className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
          {ordered.map((item, i) => {
            const picked = Boolean(vibe) && i < 3
            return (
              <li
                key={item.id}
                data-flip
                data-flip-id={item.id}
                className={cn('relative transition-opacity duration-500 max-md:[&:nth-child(n+7)]:hidden', vibe && !picked && 'opacity-45')}
              >
                {picked && (
                  <span className="sticker absolute -top-3 right-3 z-20 rotate-6 rounded-full bg-chili px-3 py-0.5 font-display text-sm font-extrabold text-espresso">
                    pick #{i + 1}
                  </span>
                )}
                <ProductCard item={item} className={cn(picked && 'ring-4 ring-cheese ring-offset-2 ring-offset-oat')} />
              </li>
            )
          })}
        </ul>

        {vibe && (
          <div className="mt-8 flex justify-center">
            <Button size="lg" onClick={addAll}>
              Add all 3 · {formatPKR(picksTotal)}
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
