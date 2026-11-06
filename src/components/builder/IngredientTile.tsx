import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { Minus } from 'lucide-react'
import type { IconSpec } from '@/data/builder'
import { SPRING, TAP_SQUISH } from '@/lib/motion-presets'
import { cn, formatPKR } from '@/lib/utils'
import { IngredientIcon } from './IngredientIcon'

interface TileBase {
  label: string
  icon: IconSpec
  /** Price shown on the tile. 0 → "included" (or `sub`). */
  price?: number
  /** Overrides the price line (e.g. a drink's base price). */
  sub?: string
  disabled?: boolean
  /** Cheese-tinted "special" tile (e.g. Top bun). */
  accent?: boolean
  compact?: boolean
}

type TileProps = TileBase &
  (
    | { mode: 'counter'; count: number; onAdd: () => void; onRemove: () => void }
    | { mode: 'radio'; name: string; value: string; checked: boolean; onSelect: () => void }
    | { mode: 'toggle'; on: boolean; onToggle: () => void }
    | { mode: 'included' }
  )

const priceText = (p?: number, sub?: string) => sub ?? (p ? `+${formatPKR(p)}` : 'included')

/**
 * One builder tile. Modes: counter (tap adds, − removes, count badge), radio (native radio input,
 * cheese tint + ✓), toggle (aria-pressed, ✓), included (static). Same look as the original burger tiles.
 */
export function IngredientTile(props: TileProps) {
  const { label, icon, price, sub, disabled, accent, compact } = props
  const selected = (props.mode === 'radio' && props.checked) || (props.mode === 'toggle' && props.on) || props.mode === 'included'
  const surface = cn(
    'relative flex w-full items-center gap-2 rounded-2xl border-[2.5px] border-oat px-3 text-left text-espresso shadow-hard-oat',
    'transition-[opacity,translate,background-color] duration-200',
    compact ? 'min-h-11 py-1.5' : 'min-h-14 py-2',
    selected || accent ? 'bg-cheese' : 'bg-oat',
    disabled && 'opacity-40',
  )
  const body: ReactNode = (
    <>
      <IngredientIcon icon={icon} className={compact ? 'size-6' : undefined} />
      <span className="min-w-0 leading-tight">
        <span className="block truncate text-sm font-bold">{label}</span>
        {!compact && <span className="block text-xs font-semibold text-ink/80">{priceText(price, sub)}</span>}
        {compact && price ? <span className="block text-[0.7rem] font-semibold text-ink/80">+{formatPKR(price)}</span> : null}
      </span>
    </>
  )
  const check = selected && (
    <span aria-hidden="true" className="absolute -top-2 -right-2 flex size-6 items-center justify-center rounded-full border-2 border-espresso bg-pickle text-xs font-extrabold text-espresso">
      ✓
    </span>
  )

  if (props.mode === 'radio') {
    return (
      <label className={cn('relative block', disabled ? 'cursor-not-allowed' : 'cursor-pointer')}>
        <input type="radio" name={props.name} value={props.value} checked={props.checked} disabled={disabled} onChange={props.onSelect} className="peer sr-only" />
        <span className={cn(surface, 'peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-(--focus-ring)', !disabled && 'hover:-translate-y-0.5')}>
          {body}
          {check}
        </span>
      </label>
    )
  }

  if (props.mode === 'included') {
    return (
      <div className={surface}>
        {body}
        {check}
      </div>
    )
  }

  if (props.mode === 'toggle') {
    return (
      <motion.button type="button" aria-pressed={props.on} disabled={disabled} whileTap={disabled ? undefined : TAP_SQUISH} transition={SPRING.bouncy} onClick={props.onToggle} className={cn(surface, 'enabled:hover:-translate-y-0.5')}>
        {body}
        {check}
      </motion.button>
    )
  }

  // counter
  const { count, onAdd, onRemove } = props
  return (
    <div className="relative">
      <motion.button
        type="button"
        disabled={disabled}
        whileTap={disabled ? undefined : TAP_SQUISH}
        transition={SPRING.bouncy}
        onClick={onAdd}
        aria-label={`Add ${label}${price ? `, plus ${formatPKR(price)}` : ''}${count ? `, ${count} added` : ''}`}
        className={cn(surface, 'enabled:hover:-translate-y-0.5', count > 0 && 'pr-11')}
      >
        {body}
      </motion.button>
      {count > 0 && (
        <>
          <span aria-hidden="true" className="pointer-events-none absolute -top-2 -right-2 flex size-6 items-center justify-center rounded-full border-2 border-espresso bg-chili text-xs font-extrabold text-espresso">
            {count}
          </span>
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remove one ${label}`}
            className="absolute top-1/2 right-1.5 flex size-8 -translate-y-1/2 items-center justify-center rounded-full border-2 border-espresso bg-oat text-espresso before:absolute before:-inset-1.5 hover:bg-chili/20"
          >
            <Minus size={16} strokeWidth={3} aria-hidden="true" />
          </button>
        </>
      )}
    </div>
  )
}
