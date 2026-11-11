import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { getItemBySlug, isPriced, type PricedItem } from '@/data/menu'
import { ROULETTE_ITEMS } from '@/data/toys'
import { useAddToCart } from '@/hooks/useAddToCart'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { Draggable, gsap, MQ, useGSAP } from '@/lib/gsap'
import { toCartInput } from '@/lib/itemOptions'
import { SPRING, TOYS } from '@/lib/motion-presets'
import { formatPKR } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { ProductImage } from '@/components/ui/ProductImage'
import { RevealHeading } from '@/components/ui/RevealHeading'
import { Mascot } from '@/components/mascot/Mascot'
import { RouletteWheel } from './RouletteWheel'

// Only items with a price (the result offers 'Add it').
const ITEMS: PricedItem[] = ROULETTE_ITEMS.map((id) => getItemBySlug(id)).filter((i): i is PricedItem => Boolean(i && isPriced(i)))
const SEG = 360 / ITEMS.length
/** Rotation r puts segment i under the top pointer when (i·seg + seg/2 + r) ≡ 0 (mod 360). */
const indexAt = (r: number) => (((Math.round(-(r + SEG / 2) / SEG) % ITEMS.length) + ITEMS.length) % ITEMS.length)
const snapToSegment = (r: number) => Math.round((r + SEG / 2) / SEG) * SEG - SEG / 2

/** Spin (button, or flick the wheel on desktop) → lands on a random item → "Add it" / "Spin again". Normal prices only. */
export function SnackRoulette() {
  const [spinning, setSpinning] = useState(false)
  const [result, setResult] = useState<PricedItem | null>(null)
  const wheel = useRef<SVGGElement>(null)
  const rotation = useRef(0)
  const resultArt = useRef<HTMLDivElement>(null)
  const addToCart = useAddToCart()
  const reduced = useReducedMotion()

  const land = (r: number) => {
    rotation.current = r
    setSpinning(false)
    setResult(ITEMS[indexAt(r)] ?? null)
  }

  const spin = () => {
    if (spinning || !wheel.current) return
    const idx = Math.floor(Math.random() * ITEMS.length)
    const base = rotation.current - (rotation.current % 360)
    const target = base + 360 * TOYS.spinTurns - (idx * SEG + SEG / 2)
    setResult(null)
    if (reduced) {
      gsap.set(wheel.current, { rotation: target, svgOrigin: '0 0' })
      return land(target)
    }
    setSpinning(true)
    gsap.to(wheel.current, { rotation: target, svgOrigin: '0 0', duration: TOYS.spin, ease: 'power4.out', onComplete: () => land(target) })
  }

  // Desktop: flick to spin (Draggable + Inertia), snapping to a segment centre.
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(`${MQ.finePointer} and ${MQ.motionOk}`, () => {
        if (!wheel.current) return
        gsap.set(wheel.current, { svgOrigin: '0 0' })
        const [d] = Draggable.create(wheel.current, {
          type: 'rotation',
          inertia: true,
          snap: snapToSegment,
          onPress: () => setResult(null),
          onDragStart: () => setSpinning(true),
          onThrowComplete(this: Draggable) {
            land(this.rotation)
          },
        })
        return () => d?.kill()
      })
    },
    { scope: wheel },
  )

  const add = () => result && addToCart(toCartInput(result), { source: resultArt.current })

  return (
    <section aria-labelledby="roulette-title" className="grain relative overflow-hidden bg-espresso px-4 py-20 text-oat sm:px-6 md:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
        <div>
          <RevealHeading id="roulette-title" className="text-display font-extrabold text-oat">
            Can't decide?
          </RevealHeading>
          <p className="mt-1 -rotate-1 font-hand text-2xl text-cheese sm:text-3xl">let the snack roulette choose 🎰</p>
          <p className="mt-4 max-w-sm text-oat/80">Spin it (or flick the wheel). Whatever it lands on is tonight's pick, at the normal menu price.</p>

          <div className="mt-8 min-h-48" aria-live="polite">
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div key={result.id} initial={{ opacity: 0, y: 20, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10 }} transition={SPRING.bouncy} className="sticker flex items-center gap-4 rounded-blob bg-oat p-4 text-espresso">
                  <div ref={resultArt} className="size-24 shrink-0 overflow-hidden rounded-2xl border-2 border-espresso">
                    <ProductImage name={result.name} emoji={result.emoji} image={result.image} category={result.category} size="sm" showName={false} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-hand text-xl">it's…</p>
                    <p className="font-display text-2xl leading-tight font-extrabold">{result.name}!</p>
                    <p className="font-bold">{formatPKR(result.price)}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button size="sm" onClick={add}>
                        Add it
                      </Button>
                      <Button size="sm" variant="outline" onClick={spin}>
                        Spin again
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="spin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Button size="lg" variant="cheese" onClick={spin} disabled={spinning}>
                    {spinning ? 'Spinning…' : 'Spin the wheel 🎰'}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-[420px]" data-cursor="drag">
          <RouletteWheel items={ITEMS} wheelRef={wheel} />
          <Mascot mood={spinning ? 'excited' : result ? 'wave' : 'idle'} className="absolute -right-2 -bottom-6 h-32 sm:h-40" label="Munchy watching the wheel" />
        </div>
      </div>
    </section>
  )
}
