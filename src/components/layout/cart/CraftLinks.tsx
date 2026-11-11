import { Link } from 'react-router'
import { site } from '@/config/site'
import { cn } from '@/lib/utils'

/** Only makers the owner switched on (site.craftMakers). */
const LINKS = ([
  { tab: 'burger', label: 'Build a burger 🍔', tone: 'bg-chili' },
  { tab: 'coffee', label: 'Make your coffee ☕', tone: 'bg-caramel' },
  { tab: 'wrap', label: 'Roll a wrap 🌯', tone: 'bg-pickle' },
] as const).filter((l) => site.craftMakers[l.tab])

/** Empty-cart shortcuts into the Craft section (Home #craft-<tab>). */
export function CraftLinks({ onNavigate, className }: { onNavigate?: () => void; className?: string }) {
  return (
    <ul className={cn('flex flex-wrap justify-center gap-2', className)} aria-label="Or craft your own">
      {LINKS.map((l) => (
        <li key={l.tab}>
          <Link
            to={`/#craft-${l.tab}`}
            onClick={onNavigate}
            className={cn('inline-flex min-h-11 items-center rounded-full border-[2.5px] border-espresso px-4 text-sm font-extrabold text-espresso shadow-hard-sm transition-[translate] hover:-translate-y-0.5', l.tone)}
          >
            {l.label}
          </Link>
        </li>
      ))}
    </ul>
  )
}
