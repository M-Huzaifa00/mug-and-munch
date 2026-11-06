import { useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface TrayGroup {
  id: string
  label: string
  /** Current choice shown on the tab, e.g. "Medium". */
  hint?: string
  content: ReactNode
}

interface TileTrayProps {
  groups: TrayGroup[]
  /** 'mobile' = group tabs only below md (all groups stacked on desktop); 'always' = tabs at every size. */
  tabs?: 'mobile' | 'always'
  /** Unique prefix for ids. */
  idPrefix: string
}

/** Group tabs (with current-choice hints) + the active group's tiles. */
export function TileTray({ groups, tabs = 'mobile', idPrefix }: TileTrayProps) {
  const [active, setActive] = useState(groups[0]?.id ?? '')
  if (groups.length === 1) return <>{groups[0]?.content}</>

  return (
    <div>
      <div role="tablist" aria-label="Choose a group" className={cn('-mx-4 mb-3 flex gap-1.5 overflow-x-auto px-4 pb-1 [scrollbar-width:none]', tabs === 'mobile' && 'md:hidden')}>
        {groups.map((g) => {
          const on = g.id === active
          return (
            <button
              key={g.id}
              type="button"
              role="tab"
              id={`${idPrefix}-tab-${g.id}`}
              aria-selected={on}
              aria-controls={`${idPrefix}-panel-${g.id}`}
              onClick={() => setActive(g.id)}
              className={cn(
                'flex min-h-11 shrink-0 flex-col items-start justify-center rounded-xl border-2 px-3 py-1 text-left leading-tight transition-colors',
                on ? 'border-cheese bg-cheese text-espresso' : 'border-oat/40 text-oat hover:border-oat',
              )}
            >
              <span className="text-[0.7rem] font-extrabold tracking-widest uppercase">{g.label}</span>
              {g.hint && <span className="max-w-32 truncate text-xs font-semibold">{g.hint}</span>}
            </button>
          )
        })}
      </div>
      <div className={cn(tabs === 'mobile' && 'md:space-y-5')}>
        {groups.map((g) => (
          <div
            key={g.id}
            role="tabpanel"
            id={`${idPrefix}-panel-${g.id}`}
            aria-labelledby={`${idPrefix}-tab-${g.id}`}
            className={cn(g.id === active ? 'block' : 'hidden', tabs === 'mobile' && 'md:block')}
          >
            {g.content}
          </div>
        ))}
      </div>
    </div>
  )
}
