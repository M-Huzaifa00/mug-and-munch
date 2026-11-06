import { useRef, useState } from 'react'
import { COFFEE_DEFAULTS, COFFEE_DRINKS, DRINK_TONE, OPTION_ICON } from '@/data/coffeeBuilder'
import { getItemBySlug, type MenuItem, type OptionChoice } from '@/data/menu'
import { useAddToCart } from '@/hooks/useAddToCart'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { track } from '@/lib/events'
import { toCartInput, unitPriceFor, type OptionSelection } from '@/lib/itemOptions'
import { cn, formatPKR } from '@/lib/utils'
import { BuilderActions } from '@/components/builder/BuilderActions'
import { IngredientTile } from '@/components/builder/IngredientTile'
import { TileGroup } from '@/components/builder/TileGroup'
import { TileTray, type TrayGroup } from '@/components/builder/TileTray'
import { CoffeeCup, type CupSize } from './CoffeeCup'
import { MAKER_STAGE } from './makerLayout'
import { SweetnessPills } from './SweetnessPills'

const DRINKS: MenuItem[] = COFFEE_DRINKS.map((s) => getItemBySlug(s)).filter((i): i is MenuItem => Boolean(i))
const MILK_TOKEN: Record<string, string> = { regular: 'oat', oat: 'cheese', almond: 'bubblegum' }
const DRIZZLE: Record<string, string> = { 'caramel-syrup': 'stroke-caramel', 'hazelnut-syrup': 'stroke-espresso', 'vanilla-syrup': 'stroke-cheese', 'extra-shot': 'stroke-espresso' }

type CoffeeState = Required<Pick<OptionSelection, 'extras'>> & { drink: string; size: string; milk?: string; temp?: string; sweetness: number }

const defaults = (): CoffeeState => ({ ...COFFEE_DEFAULTS, extras: [] })

/** Keep choices valid for the chosen drink (e.g. Americano has no milk, Cold Brew is always iced). */
function fit(state: CoffeeState, item: MenuItem): CoffeeState {
  const o = item.options
  const has = (list: OptionChoice[] | undefined, id?: string) => Boolean(id && list?.some((c) => c.id === id))
  return {
    ...state,
    size: has(o.sizes, state.size) ? state.size : (o.sizes?.[0]?.id ?? 's'),
    milk: o.milks ? (has(o.milks, state.milk) ? state.milk : o.milks[0]?.id) : undefined,
    temp: o.temps ? (has(o.temps, state.temp) ? state.temp : o.temps[0]?.id) : undefined,
    extras: state.extras.filter((e) => has(o.extras, e)),
  }
}

const liquid = (drink: string, milk?: string) => {
  const tone = DRINK_TONE[drink] ?? 'caramel'
  return milk
    ? `color-mix(in oklab, var(--color-${tone}) 62%, var(--color-${MILK_TOKEN[milk] ?? 'oat'}))`
    : `color-mix(in oklab, var(--color-${tone}) 80%, var(--color-espresso))`
}

/**
 * Coffee tab: pick drink / size / milk / hot-iced / add-ons / sweetness. Configures the REAL menu coffee,
 * so the cart line is identical to adding it from the menu (and merges with it).
 */
export function CoffeeMaker({ active, ctaLabel }: { active: boolean; ctaLabel: string }) {
  const [state, setState] = useState<CoffeeState>(defaults)
  const [drainKey, setDrainKey] = useState(0)
  const cup = useRef<HTMLDivElement>(null)
  const addToCart = useAddToCart()
  const reduced = useReducedMotion()
  const item = DRINKS.find((d) => d.id === state.drink) ?? DRINKS[0]
  if (!item) return null
  const o = item.options

  const sel: OptionSelection = { size: state.size, milk: state.milk, temp: state.temp, extras: state.extras, sweetness: state.sweetness }
  const price = unitPriceFor(item, sel)
  const set = (patch: Partial<CoffeeState>) => setState((s) => fit({ ...s, ...patch }, DRINKS.find((d) => d.id === (patch.drink ?? s.drink)) ?? item))
  const iced = state.temp === 'iced' || item.id === 'cold-brew'
  const drizzleExtra = state.extras.find((e) => DRIZZLE[e])
  const label = (list: OptionChoice[] | undefined, id?: string) => list?.find((c) => c.id === id)?.label

  const add = () => {
    addToCart(toCartInput(item, sel), { source: cup.current })
    track('coffee_maker_add', { drink: item.id, price })
  }
  const reset = () => {
    if (reduced) return setState(defaults())
    setDrainKey((k) => k + 1)
    window.setTimeout(() => setState(defaults()), 420)
  }

  const radios = (group: 'sizes' | 'milks' | 'temps', key: 'size' | 'milk' | 'temp') =>
    (o[group] ?? []).map((c) => (
      <IngredientTile key={c.id} mode="radio" compact name={`coffee-${key}`} value={c.id} checked={state[key] === c.id} label={c.label} price={c.priceDelta} icon={OPTION_ICON[c.id] ?? { shape: 'cup' }} onSelect={() => set({ [key]: c.id } as Partial<CoffeeState>)} />
    ))

  const groups: TrayGroup[] = [
    {
      id: 'drink',
      label: 'Drink',
      hint: item.name,
      content: (
        <TileGroup label="Drink" hideLabel>
          {DRINKS.map((d) => (
            <IngredientTile key={d.id} mode="radio" name="coffee-drink" value={d.id} checked={d.id === item.id} label={d.name} sub={formatPKR(d.price)} icon={{ shape: 'cup', tone: DRINK_TONE[d.id] ?? 'caramel', n: 2 }} onSelect={() => set({ drink: d.id })} />
          ))}
        </TileGroup>
      ),
    },
    { id: 'size', label: 'Size', hint: label(o.sizes, state.size), content: <TileGroup label="Size" hideLabel>{radios('sizes', 'size')}</TileGroup> },
    ...(o.milks ? [{ id: 'milk', label: 'Milk', hint: label(o.milks, state.milk), content: <TileGroup label="Milk" hideLabel>{radios('milks', 'milk')}</TileGroup> }] : []),
    ...(o.temps ? [{ id: 'temp', label: 'Hot / Iced', hint: label(o.temps, state.temp), content: <TileGroup label="Hot or iced" hideLabel>{radios('temps', 'temp')}</TileGroup> }] : []),
    {
      id: 'addons',
      label: 'Add-ons',
      hint: state.extras.length ? `${state.extras.length} added` : 'none',
      content: (
        <TileGroup label="Add-ons" hideLabel>
          {(o.extras ?? []).map((c) => {
            const on = state.extras.includes(c.id)
            return <IngredientTile key={c.id} mode="toggle" compact on={on} label={c.label} price={c.priceDelta} icon={OPTION_ICON[c.id] ?? { shape: 'drop' }} onToggle={() => set({ extras: on ? state.extras.filter((e) => e !== c.id) : [...state.extras, c.id] })} />
          })}
        </TileGroup>
      ),
    },
    { id: 'sweet', label: 'Sweetness', hint: `${state.sweetness}%`, content: <SweetnessPills name="coffee-sweetness" value={state.sweetness} onChange={(v) => set({ sweetness: v })} /> },
  ]

  return (
    <div data-maker="coffee" id="craft-panel-coffee" role="tabpanel" aria-labelledby="craft-tab-coffee" hidden={!active} className={cn(active ? 'contents' : 'hidden')}>
      <div ref={cup} className={MAKER_STAGE}>
        <span aria-hidden="true" className="absolute bottom-0 h-8 w-[min(100%,300px)] rounded-[50%] border-[2.5px] border-oat bg-caramel" />
        <div data-creation className="relative mb-4 h-[85%] md:h-[88%]" role="img" aria-label={`${item.name}, ${label(o.sizes, state.size) ?? ''}${state.milk ? `, ${label(o.milks, state.milk)}` : ''}, ${iced ? 'iced' : 'hot'}`}>
          <CoffeeCup size={state.size as CupSize} fill={liquid(item.id, state.milk)} iced={iced} drizzle={drizzleExtra ? (DRIZZLE[drizzleExtra] ?? null) : null} whipped={state.extras.includes('whipped-cream')} active={active} drainKey={drainKey} />
        </div>
      </div>
      <div data-controls className="text-oat [grid-area:controls]">
        <TileTray groups={groups} tabs="always" idPrefix="coffee" />
        <BuilderActions ctaLabel={ctaLabel} price={price} onAdd={add} onReset={reset} />
      </div>
    </div>
  )
}
