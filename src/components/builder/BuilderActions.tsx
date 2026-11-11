import { useId } from 'react'
import { Dices } from 'lucide-react'
import { formatPKR } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { RollingNumber } from '@/components/ui/RollingNumber'
import { useBuilderMode } from './builderMode'

interface BuilderActionsProps {
  /** e.g. "Add my burger" / "Update my creation". */
  ctaLabel: string
  price: number
  onAdd: () => void
  addDisabled?: boolean
  onReset: () => void
  resetDisabled?: boolean
  /** Optional "Name it" field (custom burgers / wraps). */
  name?: string
  onNameChange?: (name: string) => void
  /** Re-roll a fun name from data. */
  onRollName?: () => void
}

/**
 * CTA with live RollingNumber price, Reset, and an optional "Name it" field (max 30 chars).
 * Play mode (BuilderModeContext.ordering = false): the CTA is a disabled "Add to cart · coming soon" and nothing
 * reaches the cart; the (real) price shows beside it only when prices are confirmed.
 */
export function BuilderActions({ ctaLabel, price, onAdd, addDisabled, onReset, resetDisabled, name, onNameChange, onRollName }: BuilderActionsProps) {
  const nameId = useId()
  const { ordering, showPrices } = useBuilderMode()

  return (
    <div className="mt-5 space-y-4">
      {onNameChange && (
        <div>
          <label htmlFor={nameId} className="mb-1.5 block text-xs font-extrabold tracking-widest uppercase">
            Name it <span className="font-semibold tracking-normal normal-case opacity-80">(optional)</span>
          </label>
          <div className="flex max-w-sm items-center gap-2">
            <input
              id={nameId}
              type="text"
              value={name ?? ''}
              maxLength={30}
              enterKeyHint="done"
              autoComplete="off"
              onChange={(e) => onNameChange(e.target.value)}
              className="min-h-11 flex-1 rounded-full border-[2.5px] border-espresso bg-oat px-4 text-base font-semibold text-espresso"
            />
            {onRollName && (
              <button type="button" onClick={onRollName} aria-label="Give me another fun name" className="flex size-11 shrink-0 items-center justify-center rounded-full border-[2.5px] border-espresso bg-cheese text-espresso transition-[rotate] hover:rotate-45">
                <Dices size={20} aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
      )}
      <div className="flex flex-wrap items-center gap-3">
        {ordering ? (
          <Button size="lg" onClick={onAdd} disabled={addDisabled} className="flex-1 whitespace-nowrap sm:flex-none">
            {ctaLabel} · <RollingNumber value={price} format={formatPKR} />
          </Button>
        ) : (
          <>
            <Button size="lg" disabled aria-describedby={nameId + "-soon"} className="flex-1 whitespace-nowrap sm:flex-none">
              Add to cart · coming soon
            </Button>
            {showPrices && (
              <span className="rounded-full border-[2.5px] border-oat px-3 py-1 font-display text-lg font-extrabold">
                <RollingNumber value={price} format={formatPKR} />
              </span>
            )}
          </>
        )}
        <Button variant="outline" size="md" onClick={onReset} disabled={resetDisabled}>
          Reset
        </Button>
      </div>
      {!ordering && (
        <p id={nameId + "-soon"} className="text-sm font-semibold text-oat/80">
          Play all you want. Ordering creations online is coming soon; the full menu is orderable now.
        </p>
      )}
    </div>
  )
}
