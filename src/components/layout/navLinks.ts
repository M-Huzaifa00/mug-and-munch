import { BadgePercent, House, MapPin, UtensilsCrossed, type LucideIcon } from 'lucide-react'

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
}

/** Desktop navbar links. */
export const NAV_LINKS: { to: string; label: string }[] = [
  { to: '/menu', label: 'Menu' },
  { to: '/deals', label: 'Deals' },
  { to: '/our-story', label: 'Our Story' },
  { to: '/find-us', label: 'Find Us' },
]

/** Mobile bottom bar tabs. */
export const TAB_LINKS: NavItem[] = [
  { to: '/', label: 'Home', icon: House },
  { to: '/menu', label: 'Menu', icon: UtensilsCrossed },
  { to: '/deals', label: 'Deals', icon: BadgePercent },
  { to: '/find-us', label: 'Find Us', icon: MapPin },
]
