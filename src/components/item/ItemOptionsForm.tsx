import { SPICE_LABELS, type MenuItem, type OptionChoice } from '@/data/menu'
import type { OptionSelection } from '@/lib/itemOptions'
import { formatPKR } from '@/lib/utils'
import { OptionPills, type PillOption } from './OptionPills'

interface ItemOptionsFormProps {
  item: MenuItem
  value: OptionSelection
  onChange: (next: OptionSelection) => void
}

const toPills = (choices: OptionChoice[]): PillOption[] =>
  choices.map((c) => ({ id: c.id, label: c.label, hint: c.priceDelta > 0 ? `+${formatPKR(c.priceDelta)}` : undefined }))

/** Renders every option group the item has: size, hot/iced, milk, spice, extras. */
export function ItemOptionsForm({ item, value, onChange }: ItemOptionsFormProps) {
  const o = item.options
  const set = (patch: Partial<OptionSelection>) => onChange({ ...value, ...patch })
  const pick = (current: string | undefined) => (current ? [current] : [])

  return (
    <div className="space-y-5">
      {o.sizes && o.sizes.length > 1 && (
        <OptionPills legend="Size" name="size" options={toPills(o.sizes)} selected={pick(value.size)} onToggle={(id) => set({ size: id })} />
      )}
      {o.temps && (
        <OptionPills legend="Hot or iced" name="temp" options={toPills(o.temps)} selected={pick(value.temp)} onToggle={(id) => set({ temp: id })} />
      )}
      {o.milks && (
        <OptionPills legend="Milk" name="milk" options={toPills(o.milks)} selected={pick(value.milk)} onToggle={(id) => set({ milk: id })} />
      )}
      {item.spiceLevels && (
        <OptionPills
          legend="Spice level"
          name="spice"
          options={item.spiceLevels.map((s) => ({ id: s, label: SPICE_LABELS[s] }))}
          selected={pick(value.spice)}
          onToggle={(id) => set({ spice: item.spiceLevels?.find((s) => s === id) })}
        />
      )}
      {o.extras && (
        <OptionPills
          legend="Extras"
          name="extras"
          multiple
          options={toPills(o.extras)}
          selected={value.extras}
          onToggle={(id) =>
            set({ extras: value.extras.includes(id) ? value.extras.filter((e) => e !== id) : [...value.extras, id] })
          }
        />
      )}
    </div>
  )
}
