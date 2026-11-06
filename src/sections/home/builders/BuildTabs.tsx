import { useRef, type KeyboardEvent } from 'react'
import { cn } from '@/lib/utils'
import { Chip } from '@/components/ui/Chip'

export interface BuildTab<Id extends string> {
  id: Id
  label: string
  emoji: string
  activeBg: string
  activeText: string
}

interface BuildTabsProps<Id extends string> {
  tabs: readonly BuildTab<Id>[]
  active: Id
  onChange: (id: Id) => void
  panelId: string
  className?: string
}

/** Tab element id. BuildStudio's tabpanel uses the same `build-tab-<id>` format for aria-labelledby. */
const buildTabId = (id: string) => `build-tab-${id}`

/** WAI-ARIA tabs (roving tabindex, ←/→/Home/End) with a sliding fill. */
export function BuildTabs<Id extends string>({ tabs, active, onChange, panelId, className }: BuildTabsProps<Id>) {
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
    <div role="tablist" aria-label="What do you want to build?" onKeyDown={onKeyDown} className={cn('flex gap-1.5 sm:flex-wrap sm:gap-3', className)}>
      {tabs.map((t, i) => {
        const selected = t.id === active
        return (
          <Chip
            key={t.id}
            ref={(el) => {
              refs.current[i] = el
            }}
            role="tab"
            id={buildTabId(t.id)}
            aria-selected={selected}
            aria-controls={panelId}
            tabIndex={selected ? 0 : -1}
            active={selected}
            activeBg={t.activeBg}
            activeText={t.activeText}
            layoutId="build-studio-tab"
            onClick={() => onChange(t.id)}
            className="min-h-12 flex-1 px-2.5 text-[0.9rem] sm:flex-none sm:px-5 sm:text-lg"
          >
            {t.label} <span aria-hidden="true">{t.emoji}</span>
          </Chip>
        )
      })}
    </div>
  )
}
