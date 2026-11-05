import { useRef, type KeyboardEvent } from 'react'
import { CATEGORY_META, type Category } from '@/data/menu'
import { cn } from '@/lib/utils'
import { Chip } from '@/components/ui/Chip'

interface MenuPreviewTabsProps {
  tabs: Category[]
  active: Category
  onChange: (c: Category) => void
  panelId: string
  className?: string
}

/** WAI-ARIA tabs (roving tabindex, ←/→/Home/End) with a sliding category-coloured fill. */
export function MenuPreviewTabs({ tabs, active, onChange, panelId, className }: MenuPreviewTabsProps) {
  const refs = useRef<(HTMLButtonElement | null)[]>([])

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const index = tabs.indexOf(active)
    const next =
      e.key === 'ArrowRight' ? (index + 1) % tabs.length
      : e.key === 'ArrowLeft' ? (index - 1 + tabs.length) % tabs.length
      : e.key === 'Home' ? 0
      : e.key === 'End' ? tabs.length - 1
      : -1
    if (next < 0) return
    e.preventDefault()
    const c = tabs[next]
    if (!c) return
    onChange(c)
    refs.current[next]?.focus()
  }

  return (
    <div role="tablist" aria-label="Menu categories" onKeyDown={onKeyDown} className={cn('flex flex-wrap gap-2 sm:gap-3', className)}>
      {tabs.map((c, i) => {
        const meta = CATEGORY_META[c]
        const selected = c === active
        return (
          <Chip
            key={c}
            ref={(el) => {
              refs.current[i] = el
            }}
            role="tab"
            id={`menu-tab-${c}`}
            aria-selected={selected}
            aria-controls={panelId}
            tabIndex={selected ? 0 : -1}
            active={selected}
            activeBg={meta.bg}
            activeText={meta.text}
            layoutId="home-menu-tab"
            onClick={() => onChange(c)}
            className="min-h-12 px-5 text-base sm:text-lg"
          >
            {meta.label} <span aria-hidden="true">{meta.emoji}</span>
          </Chip>
        )
      })}
    </div>
  )
}
