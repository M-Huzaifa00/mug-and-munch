import { MapPin } from 'lucide-react'
import { Link } from 'react-router'
import { addressLine } from '@/config/site'
import { OpenBadge } from '@/components/ui/OpenBadge'

/** Top info row of the hero: live open/closed status + where we are (links to Find Us). Real data only. */
export function HeroMeta() {
  return (
    <div data-hero-meta className="flex flex-wrap items-center gap-x-4 gap-y-2">
      <OpenBadge className="shadow-hard-sm" />
      <Link to="/find-us" className="group inline-flex min-h-11 items-center gap-1.5 text-sm font-bold text-ink">
        <MapPin size={16} strokeWidth={2.6} aria-hidden="true" className="text-chili" />
        <span className="underline decoration-espresso/25 decoration-2 underline-offset-4 transition-[text-decoration-color] group-hover:decoration-chili">{addressLine}</span>
      </Link>
    </div>
  )
}
