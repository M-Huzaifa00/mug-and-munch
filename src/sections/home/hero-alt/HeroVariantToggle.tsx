import { useLocation } from 'react-router'

/**
 * DEV-only switch between the current hero and the new candidate (?hero=new). Full reload on purpose so the
 * preloader + intro play exactly like a real first visit. Never rendered in production builds.
 */
export function HeroVariantToggle() {
  const { search } = useLocation()
  const isNew = new URLSearchParams(search).get('hero') === 'new'
  const go = (next: boolean) => window.location.assign(next ? '/?hero=new' : '/')

  return (
    <div className="fixed bottom-24 left-3 z-[90] flex items-center gap-1 rounded-full border-2 border-espresso bg-oat p-1 font-display text-xs font-extrabold text-espresso shadow-hard md:bottom-6">
      <span className="px-2">Hero</span>
      <button type="button" onClick={() => go(false)} aria-pressed={!isNew} className={`min-h-9 rounded-full px-3 ${isNew ? '' : 'bg-cheese'}`}>
        current
      </button>
      <button type="button" onClick={() => go(true)} aria-pressed={isNew} className={`min-h-9 rounded-full px-3 ${isNew ? 'bg-cheese' : ''}`}>
        new
      </button>
    </div>
  )
}
