import { useState } from 'react'
import { motion } from 'motion/react'
import { NavLink, useLocation } from 'react-router'
import { SPRING } from '@/lib/motion-presets'
import { cn } from '@/lib/utils'
import { NAV_LINKS } from '../navLinks'
import { RollText } from './RollText'

/**
 * Desktop link "island": numbered links (01–04) whose letters roll on hover, with ONE blob that glides
 * between them (Motion layoutId): espresso under the hovered link, cheese under the current page.
 */
export function NavLinksPill() {
  const { pathname } = useLocation()
  const [hover, setHover] = useState<string | null>(null)
  const active = NAV_LINKS.find((l) => pathname === l.to || pathname.startsWith(`${l.to}/`))?.to ?? null
  const blobAt = hover ?? active

  return (
    <ul onMouseLeave={() => setHover(null)} className="glass flex items-center gap-0.5 rounded-full border-[2.5px] border-espresso p-1.5 shadow-hard">
      {NAV_LINKS.map((link, i) => {
        const onBlob = blobAt === link.to
        const dark = onBlob && link.to !== active
        return (
          <li key={link.to} className="relative">
            {onBlob && (
              <motion.span
                layoutId="nav-blob"
                aria-hidden="true"
                transition={SPRING.snappy}
                className={cn('absolute inset-0 rounded-full', link.to === active ? 'bg-cheese' : 'bg-espresso')}
              />
            )}
            <NavLink
              to={link.to}
              onMouseEnter={() => setHover(link.to)}
              onFocus={() => setHover(link.to)}
              onBlur={() => setHover(null)}
              className={cn(
                'group relative z-10 inline-flex min-h-11 items-center gap-1 rounded-full px-4 font-display text-[0.95rem] font-extrabold tracking-tight transition-colors duration-300',
                dark ? 'text-oat' : 'text-espresso',
              )}
            >
              <span aria-hidden="true" className="self-start pt-2 text-[0.6rem] font-bold opacity-60">
                0{i + 1}
              </span>
              <RollText>{link.label}</RollText>
            </NavLink>
          </li>
        )
      })}
    </ul>
  )
}
