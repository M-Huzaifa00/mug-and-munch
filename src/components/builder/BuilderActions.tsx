import { useId } from 'react'
import { Dices } from 'lucide-react'
import { formatPKR } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { RollingNumber } from '@/components/ui/RollingNumber'

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

/** CTA with live RollingNumber price, Reset, and an optional "Name it" field (max 30 chars). */
export function BuilderActions({ ctaLabel, price, onAdd, addDisabled, onReset, resetDisabled, name, onNameChange, onRollName }: BuilderActionsProps) {
  const nameId = useId()

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
        <Button size="lg" onClick={onAdd} disabled={addDisabled} className="flex-1 whitespace-nowrap sm:flex-none">
          {ctaLabel} · <RollingNumber value={price} format={formatPKR} />
        </Button>
        <Button variant="outline" size="md" onClick={onReset} disabled={resetDisabled}>
          Reset
        </Button>
      </div>
    </div>
  )
}
