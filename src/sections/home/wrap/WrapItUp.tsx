import { useRef, useState } from 'react'
import { getItemsByCategory } from '@/data/menu'
import { WRAP_BUILDER, type WrapFillingId } from '@/data/toys'
import { useAddToCart } from '@/hooks/useAddToCart'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { canAdd } from '@/lib/builder'
import { gsap, MQ, useGSAP } from '@/lib/gsap'
import { EASE, STAGGER } from '@/lib/motion-presets'
import { formatPKR } from '@/lib/utils'
import { wrapPrice, wrapToCartInput } from '@/lib/wrapBuilder'
import { Button } from '@/components/ui/Button'
import { ProductCard } from '@/components/ui/ProductCard'
import { RevealHeading } from '@/components/ui/RevealHeading'
import { RollingNumber } from '@/components/ui/RollingNumber'
import { IngredientPicker } from '../builders/IngredientPicker'
import { resetWrapScene, rollWrap, setRolled } from './wrapAnimations'
import { WrapFilling } from './WrapFilling'
import { WrapStage } from './WrapStage'

const HOUSE_WRAPS = getItemsByCategory('wrap')
type Phase = 'build' | 'rolling' | 'rolled'

/** Build your wrap: pick fillings (they drop onto the tortilla) → "Roll it" rolls it up → custom cart line. */
export function WrapItUp() {
  const [fillings, setFillings] = useState<{ key: number; id: WrapFillingId }[]>([])
  const [phase, setPhase] = useState<Phase>('build')
  const [announce, setAnnounce] = useState('')
  const nextKey = useRef(1)
  const stage = useRef<HTMLDivElement>(null)
  const section = useRef<HTMLElement>(null)
  const cards = useRef<HTMLUListElement>(null)
  const addToCart = useAddToCart()
  const reduced = useReducedMotion()
  const ids = fillings.map((f) => f.id)
  const price = wrapPrice(ids)

  // House wraps slide in once.
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MQ.motionOk, () => {
        gsap.from('[data-wrap-card]', { x: 90, opacity: 0, duration: 0.7, ease: EASE.out, stagger: STAGGER.cards, scrollTrigger: { trigger: cards.current, start: 'top 85%', once: true } })
      })
    },
    { scope: section },
  )

  const add = (id: WrapFillingId) => {
    if (phase !== 'build' || !canAdd(WRAP_BUILDER.ingredients, ids, id, WRAP_BUILDER.maxFillings)) return
    const key = nextKey.current
    nextKey.current += 1
    setFillings((prev) => [...prev, { key, id }])
    const label = WRAP_BUILDER.ingredients.find((i) => i.id === id)?.label ?? id
    setAnnounce(`${label} added. Total ${formatPKR(wrapPrice([...ids, id]))}`)
  }

  const roll = () => {
    const el = stage.current
    if (!el || phase !== 'build' || ids.length === 0) return
    const done = () => {
      setPhase('rolled')
      setAnnounce('Wrap rolled and added to cart')
      addToCart(wrapToCartInput(ids), { source: el })
    }
    setPhase('rolling')
    if (reduced) {
      setRolled(el)
      done()
    } else rollWrap(el, done)
  }

  const reset = () => {
    const el = stage.current
    const clear = () => {
      setFillings([])
      setPhase('build')
      setAnnounce('New tortilla ready')
      if (el) requestAnimationFrame(() => resetWrapScene(el))
    }
    if (!el || reduced) return clear()
    gsap.to(el, {
      y: 40,
      autoAlpha: 0,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => {
        clear()
        gsap.fromTo(el, { y: -40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.45, ease: EASE.bouncy, delay: 0.05 })
      },
    })
  }

  return (
    <section ref={section} aria-labelledby="wrap-title" className="grain relative overflow-hidden bg-pickle px-4 py-20 sm:px-6 md:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2">
        <div className="relative mx-auto aspect-[40/27] w-full max-w-[520px]">
          <div ref={stage} className="h-full w-full" role="img" aria-label={`Your wrap: ${ids.length} fillings${phase === 'rolled' ? ', rolled' : ''}`}>
            <WrapStage>
              {fillings.map((f, i) => (
                <WrapFilling key={f.key} kind={f.id} slot={i} />
              ))}
            </WrapStage>
          </div>
          {ids.length === 0 && <p className="absolute inset-x-0 top-2 text-center font-hand text-2xl text-espresso">pick your fillings ✨</p>}
        </div>

        <div>
          <RevealHeading id="wrap-title" className="text-display font-extrabold text-espresso">
            Wrap it up
          </RevealHeading>
          <p className="mt-1 mb-6 -rotate-1 font-hand text-2xl text-espresso sm:text-3xl">rolled tight, packed right 🌯</p>
          <IngredientPicker ingredients={WRAP_BUILDER.ingredients} picks={ids} maxTotal={WRAP_BUILDER.maxFillings} onAdd={add} locked={phase !== 'build'} tone="light" />
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {phase === 'rolled' ? (
              <Button size="lg" variant="dark" onClick={reset}>
                Roll another 🌯
              </Button>
            ) : (
              <>
                <Button size="lg" onClick={roll} disabled={ids.length === 0 || phase === 'rolling'} className="flex-1 whitespace-nowrap sm:flex-none">
                  Roll it & add · <RollingNumber value={price} format={formatPKR} />
                </Button>
                <Button variant="outline" size="md" onClick={reset} disabled={ids.length === 0 || phase === 'rolling'}>
                  Reset
                </Button>
              </>
            )}
          </div>
          <p className="sr-only" aria-live="polite">
            {announce}
          </p>
        </div>
      </div>

      <div className="mx-auto mt-20 max-w-6xl">
        <h3 className="font-display text-3xl font-extrabold text-espresso">…or grab a house favourite</h3>
        <ul ref={cards} className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:gap-6">
          {HOUSE_WRAPS.map((item) => (
            <li key={item.id} data-wrap-card>
              <ProductCard item={item} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
