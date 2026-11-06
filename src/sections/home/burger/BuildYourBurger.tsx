import { useRef, useState } from 'react'
import { BURGER_BUILDER, type BurgerLayerId } from '@/data/toys'
import { useAddToCart } from '@/hooks/useAddToCart'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { burgerPrice, burgerToCartInput, countOf, ingredient } from '@/lib/burgerBuilder'
import { gsap } from '@/lib/gsap'
import { TOYS } from '@/lib/motion-presets'
import { formatPKR } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { RevealHeading } from '@/components/ui/RevealHeading'
import { RollingNumber } from '@/components/ui/RollingNumber'
import { BurgerControls } from './BurgerControls'
import { BurgerLayer } from './BurgerLayer'

interface Layer {
  key: number
  id: BurgerLayerId
}

/** Tap ingredients → layers drop & stack; live price; "Add my creation"; reset topples the tower. */
export function BuildYourBurger() {
  const [layers, setLayers] = useState<Layer[]>([])
  const [round, setRound] = useState(0)
  const [announce, setAnnounce] = useState('')
  const nextKey = useRef(1)
  const stage = useRef<HTMLDivElement>(null)
  const stack = useRef<HTMLDivElement>(null)
  const addToCart = useAddToCart()
  const reduced = useReducedMotion()

  const ids = layers.map((l) => l.id)
  const price = burgerPrice(ids)
  const fillings = ids.filter((id) => id !== 'bun').length

  const addLayer = (id: BurgerLayerId) => {
    const ing = ingredient(id)
    if (!ing || ids.includes('bun') || ids.length >= BURGER_BUILDER.maxLayers || countOf(ids, id) >= ing.max) return
    const key = nextKey.current
    nextKey.current += 1
    setLayers((prev) => [...prev, { key, id }])
    setAnnounce(`${ing.label} added. Total ${formatPKR(burgerPrice([...ids, id]))}`)
  }

  const finish = () => {
    if (fillings === 0) return
    const closedIds = ids.includes('bun') ? ids : [...ids, 'bun' as const]
    if (!ids.includes('bun')) addLayer('bun')
    const add = () => addToCart(burgerToCartInput(closedIds), { source: stack.current })
    if (reduced || ids.includes('bun')) add()
    else window.setTimeout(add, (TOYS.drop + TOYS.settle) * 1000)
  }

  const clear = () => {
    setLayers([])
    setRound((r) => r + 1)
    setAnnounce('Burger reset')
  }

  // Topple: each layer tumbles off; the tween clears itself (targets unmount on completion).
  const reset = () => {
    const els = stage.current ? Array.from(stage.current.querySelectorAll<SVGElement>('[data-layer]')) : []
    if (reduced || layers.length === 0 || els.length === 0) return clear()
    gsap.to(els, {
      rotation: (i) => (i % 2 ? 1 : -1) * (25 + i * 7),
      x: (i) => (i % 2 ? 1 : -1) * (120 + i * 22),
      y: 360,
      opacity: 0,
      duration: TOYS.topple,
      ease: 'power2.in',
      stagger: { each: 0.05, from: 'end' }, // top of the tower falls first
      onComplete: clear,
    })
  }

  return (
    <section aria-labelledby="burger-title" className="grain relative overflow-hidden bg-espresso px-4 py-20 text-oat sm:px-6 md:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2">
        <div className="order-2 md:order-1">
          <RevealHeading id="burger-title" className="text-display font-extrabold text-oat">
            Build your burger
          </RevealHeading>
          <p className="mt-1 mb-6 -rotate-1 font-hand text-2xl text-cheese sm:text-3xl">garma garam, fresh off the grill 🔥</p>
          <BurgerControls layers={ids} onAdd={addLayer} />
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button size="lg" onClick={finish} disabled={fillings === 0} className="flex-1 whitespace-nowrap sm:flex-none">
              Add my creation · <RollingNumber value={price} format={formatPKR} />
            </Button>
            <Button variant="outline" size="md" onClick={reset} disabled={layers.length === 0}>
              Reset
            </Button>
          </div>
          <p className="sr-only" aria-live="polite">
            {announce}
          </p>
        </div>

        <div ref={stage} className="relative order-1 mx-auto flex h-[340px] w-full max-w-[300px] items-end justify-center md:order-2 md:h-[460px]">
          <span aria-hidden="true" className="absolute bottom-0 h-8 w-[118%] rounded-[50%] border-[2.5px] border-oat bg-caramel" />
          {/* Bottom-up DOM order + column-reverse → each upper layer paints over the one below (cheese drips on the patty). */}
          <div ref={stack} className="relative mb-4 flex w-full flex-col-reverse justify-start" role="img" aria-label={`Your burger: ${fillings} fillings`}>
            <BurgerLayer key={`bottom-${round}`} kind="bottom" drop={round > 0} />
            {layers.map((l) => (
              <BurgerLayer key={l.key} kind={l.id} />
            ))}
          </div>
          {fillings === 0 && (
            <p className="absolute top-6 text-center font-hand text-2xl text-cheese">tap an ingredient to start ✨</p>
          )}
        </div>
      </div>
    </section>
  )
}
