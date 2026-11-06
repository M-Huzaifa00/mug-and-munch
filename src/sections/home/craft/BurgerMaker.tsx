import { useRef, useState } from 'react'
import { BURGER_BUILDER, type BurgerLayerId } from '@/data/builder'
import { useAddToCart } from '@/hooks/useAddToCart'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { canAdd, countOf, pickFunName } from '@/lib/builder'
import { burgerPrice, burgerToCartInput } from '@/lib/burgerBuilder'
import { track } from '@/lib/events'
import { gsap } from '@/lib/gsap'
import { TOYS } from '@/lib/motion-presets'
import { cn, formatPKR } from '@/lib/utils'
import { BuilderActions } from '@/components/builder/BuilderActions'
import { IngredientTile } from '@/components/builder/IngredientTile'
import { TileGroup } from '@/components/builder/TileGroup'
import { BurgerLayer } from './BurgerLayer'
import { MAKER_STAGE } from './makerLayout'
import { EditBanner } from './EditBanner'
import { UPDATE_LABEL, useCraftEdit, usePreloadEdit } from './useCraftEdit'

interface Layer {
  key: number
  id: BurgerLayerId
}

const B = BURGER_BUILDER

/**
 * Burger tab of the Craft section (the original Build Your Burger, on the Builder Kit):
 * tap ingredients → layers drop & stack; live price; optional name; reset topples the tower.
 */
export function BurgerMaker({ active, ctaLabel }: { active: boolean; ctaLabel: string }) {
  const [layers, setLayers] = useState<Layer[]>([])
  const [round, setRound] = useState(0)
  const [name, setName] = useState(() => pickFunName(B.funNames))
  const [announce, setAnnounce] = useState('')
  const nextKey = useRef(1)
  const stage = useRef<HTMLDivElement>(null)
  const stack = useRef<HTMLDivElement>(null)
  const addToCart = useAddToCart()
  const reduced = useReducedMotion()
  const editing = useCraftEdit('burger')

  // Edit: preload the line's layers + name (bun closes on update, like a normal add).
  usePreloadEdit(editing, (line) => {
    const loaded = (line.options.layers ?? []) as BurgerLayerId[]
    // Negative keys never clash with taps (nextKey counts up from 1).
    setLayers(loaded.map((id, i) => ({ key: -(i + 1), id })))
    setName(line.options.name ?? '')
    setRound((r) => r + 1)
  })

  const ids = layers.map((l) => l.id)
  const price = burgerPrice(ids)
  const fillings = ids.filter((id) => id !== 'bun').length
  const closed = ids.includes('bun')

  const addLayer = (id: BurgerLayerId) => {
    if (closed || !canAdd(B.ingredients, ids, id, B.maxLayers)) return
    const key = nextKey.current
    nextKey.current += 1
    setLayers((prev) => [...prev, { key, id }])
    const label = B.ingredients.find((i) => i.id === id)?.label ?? id
    setAnnounce(`${label} added. Total ${formatPKR(burgerPrice([...ids, id]))}`)
  }

  /** Remove the top-most layer of this kind. */
  const removeLayer = (id: BurgerLayerId) => {
    const idx = ids.lastIndexOf(id)
    if (idx < 0) return
    setLayers((prev) => prev.filter((_, i) => i !== idx))
    setAnnounce(`${B.ingredients.find((i) => i.id === id)?.label ?? id} removed`)
  }

  const finish = () => {
    if (fillings === 0) return
    const closedIds = closed ? ids : [...ids, 'bun' as const]
    if (!closed) addLayer('bun')
    const add = () => {
      addToCart(burgerToCartInput(closedIds, name), { source: stack.current, replaceLineId: editing?.lineId })
      track('burger_maker_add', { price: burgerPrice(closedIds), layers: closedIds.length })
    }
    if (reduced || closed) add()
    else window.setTimeout(add, (TOYS.drop + TOYS.settle) * 1000)
  }

  const clear = () => {
    setLayers([])
    setRound((r) => r + 1)
    setAnnounce('Burger reset')
  }

  // Topple: each layer tumbles off (top first); the tween ends by clearing state.
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
      stagger: { each: 0.05, from: 'end' },
      onComplete: clear,
    })
  }

  return (
    <div data-maker="burger" id="craft-panel-burger" role="tabpanel" aria-labelledby="craft-tab-burger" hidden={!active} className={cn(active ? 'contents' : 'hidden')}>
      <div ref={stage} className={MAKER_STAGE}>
        <span aria-hidden="true" className="absolute bottom-0 h-8 w-[min(118%,340px)] rounded-[50%] border-[2.5px] border-oat bg-caramel" />
        <div data-creation className="relative mb-4 w-full max-w-[260px] sm:max-w-[300px]">
          {/* Bottom-up DOM order + column-reverse → each upper layer paints over the one below. */}
          <div ref={stack} className="flex w-full flex-col-reverse justify-start" role="img" aria-label={`Your burger: ${fillings} fillings`}>
            <BurgerLayer key={`bottom-${round}`} kind="bottom" drop={round > 0} />
            {layers.map((l) => (
              <BurgerLayer key={l.key} kind={l.id} />
            ))}
          </div>
        </div>
        {fillings === 0 && <p className="absolute top-4 text-center font-hand text-2xl text-cheese">tap an ingredient to start ✨</p>}
      </div>

      <div data-controls className="text-oat [grid-area:controls]">
        <TileGroup label="Ingredients" hideLabel>
          {B.ingredients.map((ing) => (
            <IngredientTile
              key={ing.id}
              mode="counter"
              label={ing.label}
              icon={ing.icon}
              price={ing.price}
              accent={ing.id === 'bun'}
              count={countOf(ids, ing.id)}
              disabled={closed || !canAdd(B.ingredients, ids, ing.id, B.maxLayers)}
              onAdd={() => addLayer(ing.id)}
              onRemove={() => removeLayer(ing.id)}
            />
          ))}
        </TileGroup>
        {editing && <EditBanner />}
        <BuilderActions
          ctaLabel={editing ? UPDATE_LABEL : ctaLabel}
          price={price}
          onAdd={finish}
          addDisabled={fillings === 0}
          onReset={reset}
          resetDisabled={layers.length === 0}
          name={name}
          onNameChange={setName}
          onRollName={() => setName((n) => pickFunName(B.funNames, n))}
        />
        <p className="sr-only" aria-live="polite">
          {announce}
        </p>
      </div>
    </div>
  )
}
