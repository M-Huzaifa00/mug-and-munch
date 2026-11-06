import { useRef, type KeyboardEvent } from 'react'
import { cn } from '@/lib/utils'
import { Chip } from '@/components/ui/Chip'

export type CraftTab = 'coffee' | 'burger' | 'wrap'

export interface CraftSwitchTab {
  id: CraftTab
  label: string
  emoji: string
  activeBg: string
  activeText: string
}

interface CraftSwitchProps {
  tabs: readonly CraftSwitchTab[]
  active: CraftTab
  onChange: (id: CraftTab) => void
  className?: string
}

/**
 * Segmented control (WAI-ARIA tabs): ←/→/Home/End move + select, Enter/Space select (native button).
 * The active pill slides between tabs (Motion layoutId) and fills with the category colour.
 */
export function CraftSwitch({ tabs, active, onChange, className }: CraftSwitchProps) {
  const refs = useRef<(HTMLButtonElement | null)[]>([])

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = tabs.findIndex((t) => t.id === active)
    const next =
      e.key === 'ArrowRight' ? (i + 1) % tabs.length
      : e.key === 'ArrowLeft' ? (i - 1 + tabs.length) % tabs.length
      : e.key === 'Home' ? 0
      : e.key === 'End' ? tabs.length - 1
      : -1
    const tab = tabs[next]
    if (next < 0 || !tab) return
    e.preventDefault()
    onChange(tab.id)
    refs.current[next]?.focus()
  }

  return (
    <div
      role="tablist"
      aria-label="What do you want to craft?"
      onKeyDown={onKeyDown}
      className={cn('inline-flex w-full gap-1 rounded-full border-[2.5px] border-oat/40 bg-espresso p-1 sm:w-auto', className)}
    >
      {tabs.map((t, i) => {
        const selected = t.id === active
        return (
          <Chip
            key={t.id}
            ref={(el) => {
              refs.current[i] = el
            }}
            role="tab"
            id={`craft-tab-${t.id}`}
            aria-selected={selected}
            aria-controls={`craft-panel-${t.id}`}
            tabIndex={selected ? 0 : -1}
            active={selected}
            activeBg={t.activeBg}
            activeText={t.activeText}
            layoutId="craft-switch"
            onClick={() => onChange(t.id)}
            className={cn('min-h-12 flex-1 border-transparent px-3 text-[0.95rem] sm:flex-none sm:px-6 sm:text-lg', !selected && 'bg-transparent text-oat hover:bg-oat/10')}
          >
            <span className={cn(!selected && 'text-oat')}>
              {t.label} <span aria-hidden="true">{t.emoji}</span>
            </span>
          </Chip>
        )
      })}
    </div>
  )
}
