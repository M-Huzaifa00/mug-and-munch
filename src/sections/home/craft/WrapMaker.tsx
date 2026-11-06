import { useRef, useState } from 'react'
import { WRAP_DEFAULTS, WRAP_MAKER, type WrapChoice } from '@/data/wrapBuilder'
import { useAddToCart } from '@/hooks/useAddToCart'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { pickFunName } from '@/lib/builder'
import { track } from '@/lib/events'
import { gsap } from '@/lib/gsap'
import { cn } from '@/lib/utils'
import { wrapFillingCount, wrapPrice, wrapToCartInput } from '@/lib/wrapBuilder'
import { BuilderActions } from '@/components/builder/BuilderActions'
import { IngredientTile } from '@/components/builder/IngredientTile'
import { TileGroup } from '@/components/builder/TileGroup'
import { TileTray, type TrayGroup } from '@/components/builder/TileTray'
import { MAKER_STAGE } from './makerLayout'
import { resetWrapScene, rollWrap } from './wrapAnimations'
import { WrapFilling } from './WrapFilling'
import { WrapStage } from './WrapStage'

const M = WRAP_MAKER
type ListKey = 'cheeses' | 'veggies' | 'sauces'
const labelOf = (list: readonly { id: string; label: string }[], id: string) => list.find((c) => c.id === id)?.label ?? id

/**
 * Wrap tab: base / protein (+double) / cheese / veggies / sauces / spice. Fillings drop on the open tortilla
 * (tap one to remove it). "Add my wrap" rolls it up, flies it to the cart, then the board reopens with the same choices.
 */
export function WrapMaker({ active, ctaLabel }: { active: boolean; ctaLabel: string }) {
  const [choice, setChoice] = useState<WrapChoice>(WRAP_DEFAULTS)
  const [name, setName] = useState(() => pickFunName(M.funNames))
  const [rolling, setRolling] = useState(false)
  const [note, setNote] = useState('')
  const [round, setRound] = useState(0)
  const stage = useRef<HTMLDivElement>(null)
  const addToCart = useAddToCart()
  const reduced = useReducedMotion()

  const count = wrapFillingCount(choice)
  const price = wrapPrice(choice)
  const room = count < M.maxFillings

  const update = (next: WrapChoice) => {
    if (wrapFillingCount(next) > M.maxFillings) return setNote(M.tooFull)
    setNote('')
    setChoice(next)
  }
  const toggleIn = (key: ListKey, id: string) => {
    const list = choice[key] as string[]
    const on = list.includes(id)
    if (!on && key === 'sauces' && list.length >= M.maxSauces) return setNote(`Max ${M.maxSauces} sauces, warna sab mix ho jayega 😅`)
    update({ ...choice, [key]: on ? list.filter((x) => x !== id) : [...list, id] } as WrapChoice)
  }

  const fillings = [
    { key: 'protein-0', kind: choice.protein, remove: undefined as (() => void) | undefined },
    ...(choice.double ? [{ key: 'protein-1', kind: choice.protein, remove: () => update({ ...choice, double: false }) }] : []),
    ...(['cheeses', 'veggies', 'sauces'] as ListKey[]).flatMap((k) => (choice[k] as string[]).map((id) => ({ key: `${k}-${id}`, kind: id, remove: () => toggleIn(k, id) }))),
  ]

  const add = () => {
    const el = stage.current
    if (!el || rolling) return
    const input = wrapToCartInput(choice, name)
    const done = () => {
      addToCart(input, { source: el })
      track('wrap_maker_add', { price: input.unitPrice, fillings: count })
      window.setTimeout(() => {
        resetWrapScene(el)
        setRolling(false)
      }, reduced ? 0 : 700)
    }
    setRolling(true)
    if (reduced) done()
    else rollWrap(el, done)
  }

  const clear = () => {
    setChoice(WRAP_DEFAULTS)
    setNote('')
    setRound((r) => r + 1)
  }
  const reset = () => {
    const group = stage.current?.querySelector('[data-fillings]')
    if (reduced || !group) return clear()
    gsap.to(group, {
      x: 300,
      autoAlpha: 0,
      duration: 0.35,
      ease: 'power2.in',
      onComplete: () => {
        clear()
        gsap.set(group, { clearProps: 'all' })
      },
    })
  }

  const radio = (key: 'base' | 'protein' | 'spice', list: readonly { id: string; label: string; price: number; icon: Parameters<typeof IngredientTile>[0]['icon'] }[], compact = false) =>
    list.map((c) => <IngredientTile key={c.id} mode="radio" compact={compact} name={`wrap-${key}`} value={c.id} checked={choice[key] === c.id} label={c.label} price={c.price} sub={c.price ? undefined : key === 'spice' ? 'free' : 'included'} icon={c.icon} onSelect={() => update({ ...choice, [key]: c.id } as WrapChoice)} />)

  const toggles = (key: ListKey, list: readonly { id: string; label: string; price: number; icon: Parameters<typeof IngredientTile>[0]['icon'] }[]) =>
    list.map((c) => {
      const on = (choice[key] as string[]).includes(c.id)
      if (key === 'veggies') {
        return <IngredientTile key={c.id} mode="counter" compact label={c.label} price={c.price} icon={c.icon} count={on ? 1 : 0} disabled={on || !room} onAdd={() => toggleIn(key, c.id)} onRemove={() => toggleIn(key, c.id)} />
      }
      return <IngredientTile key={c.id} mode="toggle" compact on={on} label={c.label} price={c.price} icon={c.icon} disabled={!on && (!room || (key === 'sauces' && choice.sauces.length >= M.maxSauces))} onToggle={() => toggleIn(key, c.id)} />
    })

  const groups: TrayGroup[] = [
    { id: 'base', label: 'Base', hint: labelOf(M.bases, choice.base), content: <TileGroup label="Base" hideLabel>{radio('base', M.bases)}</TileGroup> },
    {
      id: 'protein',
      label: 'Protein',
      hint: `${labelOf(M.proteins, choice.protein)}${choice.double ? ' ×2' : ''}`,
      content: (
        <TileGroup label="Protein" hideLabel>
          {[
            ...radio('protein', M.proteins, true),
            <IngredientTile key="double" mode="toggle" compact on={choice.double} label="Double it" price={M.proteins.find((p) => p.id === choice.protein)?.price ?? 0} icon={{ shape: 'chunks', tone: 'chili' }} disabled={!choice.double && !room} onToggle={() => update({ ...choice, double: !choice.double })} />,
          ]}
        </TileGroup>
      ),
    },
    { id: 'cheese', label: 'Cheese', hint: choice.cheeses.length ? choice.cheeses.map((c) => labelOf(M.cheeses, c)).join(', ') : 'none', content: <TileGroup label="Cheese" hideLabel>{toggles('cheeses', M.cheeses)}</TileGroup> },
    { id: 'veggies', label: 'Veggies', hint: `${choice.veggies.length} added`, content: <TileGroup label="Veggies" hideLabel>{toggles('veggies', M.veggies)}</TileGroup> },
    { id: 'sauces', label: 'Sauces', hint: `${choice.sauces.length}/${M.maxSauces}`, content: <TileGroup label="Sauces" hideLabel note={`Max ${M.maxSauces}`}>{toggles('sauces', M.sauces)}</TileGroup> },
    { id: 'spice', label: 'Spice', hint: labelOf(M.spice, choice.spice), content: <TileGroup label="Spice" hideLabel>{radio('spice', M.spice, true)}</TileGroup> },
  ]

  return (
    <div data-maker="wrap" id="craft-panel-wrap" role="tabpanel" aria-labelledby="craft-tab-wrap" hidden={!active} className={cn(active ? 'contents' : 'hidden')}>
      <div className={MAKER_STAGE}>
        <div ref={stage} data-creation className="relative mb-2 aspect-[40/27] w-full max-w-[480px]" role="img" aria-label={`Your wrap: ${count} fillings`}>
          <WrapStage base={choice.base} spice={choice.spice}>
            {fillings.map((f, i) => (
              <WrapFilling key={`${round}-${f.key}`} kind={f.kind} slot={i} onRemove={rolling ? undefined : f.remove} />
            ))}
          </WrapStage>
        </div>
      </div>
      <div data-controls className="text-oat [grid-area:controls]">
        <TileTray groups={groups} tabs="always" idPrefix="wrap" />
        <p className="mt-2 min-h-6 font-hand text-xl text-cheese" aria-live="polite">
          {note || `${count}/${M.maxFillings} fillings`}
        </p>
        <BuilderActions
          ctaLabel={ctaLabel}
          price={price}
          onAdd={add}
          addDisabled={rolling}
          onReset={reset}
          resetDisabled={rolling}
          name={name}
          onNameChange={setName}
          onRollName={() => setName((n) => pickFunName(M.funNames, n))}
        />
      </div>
    </div>
  )
}
