import { cn } from '@/lib/utils'

export interface PillOption {
  id: string
  label: string
  /** e.g. "+Rs 150" */
  hint?: string
}

interface OptionPillsProps {
  legend: string
  name: string
  options: PillOption[]
  /** Selected ids (one for radio, many for checkbox). */
  selected: string[]
  onToggle: (id: string) => void
  multiple?: boolean
}

/**
 * Radio (single) or checkbox (multiple) pill group built on native inputs,
 * so arrow keys / Space / Tab all work for free.
 */
export function OptionPills({ legend, name, options, selected, onToggle, multiple = false }: OptionPillsProps) {
  return (
    <fieldset>
      <legend className="mb-2 text-xs font-extrabold tracking-widest text-ink uppercase">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const checked = selected.includes(o.id)
          return (
            <label key={o.id} className="relative cursor-pointer">
              <input
                type={multiple ? 'checkbox' : 'radio'}
                name={name}
                value={o.id}
                checked={checked}
                onChange={() => onToggle(o.id)}
                className="peer sr-only"
              />
              <span
                className={cn(
                  'flex min-h-11 items-center gap-1.5 rounded-full border-[2.5px] border-espresso px-4 font-semibold text-espresso',
                  'transition-[background-color,box-shadow,translate] duration-200 select-none',
                  'peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-(--focus-ring)',
                  checked ? '-translate-y-0.5 bg-cheese font-bold shadow-hard-sm' : 'bg-oat hover:bg-espresso/10',
                )}
              >
                {multiple && <span aria-hidden="true">{checked ? '✓' : '+'}</span>}
                {o.label}
                {o.hint && <span className="text-xs font-bold text-ink/80">{o.hint}</span>}
              </span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}
