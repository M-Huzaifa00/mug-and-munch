import { useEffect, useRef } from 'react'
import { motion } from 'motion/react'
import { ArrowUpRight, MapPin } from 'lucide-react'
import { Link, NavLink, useLocation } from 'react-router'
import { addressLine, instagramUrl, site } from '@/config/site'
import { useFocusTrap } from '@/hooks/useFocusTrap'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useScrollLock } from '@/hooks/useScrollLock'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/brand/Logo'
import { buttonClasses } from '@/components/ui/buttonClasses'
import { OpenBadge } from '@/components/ui/OpenBadge'
import { InstagramIcon } from '@/components/ui/SocialIcons'
import { NAV_LINKS } from '../navLinks'
import { MenuToggle } from './MenuToggle'
import { RollText } from './RollText'

const LINKS = [{ to: '/', label: 'Home' }, ...NAV_LINKS]
const EASE_OUT = [0.22, 1, 0.36, 1] as const
/** The circle grows from the menu button (top-right). */
const CLIP_FROM = 'circle(0% at calc(100% - 2.5rem) 2.25rem)'
const CLIP_TO = 'circle(150% at calc(100% - 2.5rem) 2.25rem)'

/**
 * Phone / tablet menu: full-screen espresso sheet revealed by a circle wipe from the button, giant numbered
 * links that roll on hover and stagger in, then the live open badge, address, Instagram and Order Now.
 * Dialog semantics: focus trap + Esc, scroll lock, closes on navigation. Reduced motion: simple fade.
 */
export function MenuOverlay({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const { pathname } = useLocation()
  const openedAt = useRef(pathname)
  useScrollLock(true)
  useFocusTrap(ref, true, onClose)

  useEffect(() => {
    if (pathname !== openedAt.current) onClose()
  }, [pathname, onClose])

  return (
    <motion.div
      ref={ref}
      id="site-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      data-lenis-prevent
      initial={reduced ? { opacity: 0 } : { clipPath: CLIP_FROM }}
      animate={reduced ? { opacity: 1 } : { clipPath: CLIP_TO }}
      exit={reduced ? { opacity: 0 } : { clipPath: CLIP_FROM }}
      transition={{ duration: reduced ? 0.2 : 0.65, ease: EASE_OUT }}
      className="grain fixed inset-0 z-[60] flex flex-col overflow-y-auto overscroll-contain bg-espresso px-4 pt-3 pb-10 text-oat sm:px-6"
    >
      <div className="flex items-center justify-between">
        <Link to="/" onClick={onClose} aria-label={`${site.brandName} home`} className="rounded-full">
          <Logo variant="horizontal" size={40} tone="light" alt="" />
        </Link>
        <MenuToggle open onToggle={onClose} onDark />
      </div>

      <nav aria-label="Site" className="mt-12">
        <ul className="space-y-1">
          {LINKS.map((link, i) => (
            <motion.li
              key={link.to}
              initial={reduced ? false : { y: 70, opacity: 0, rotate: 4 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              transition={{ delay: reduced ? 0 : 0.18 + i * 0.07, duration: 0.6, ease: EASE_OUT }}
            >
              <NavLink
                to={link.to}
                end={link.to === '/'}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    'group flex items-baseline gap-3 border-b-2 border-oat/10 py-2 font-display text-[clamp(2.75rem,13vw,5.5rem)] leading-none font-extrabold tracking-tight',
                    isActive ? 'text-cheese' : 'text-oat',
                  )
                }
              >
                <span aria-hidden="true" className="font-sans text-sm font-bold text-cheese">
                  0{i + 1}
                </span>
                <RollText>{link.label}</RollText>
                <ArrowUpRight aria-hidden="true" className="ml-auto size-8 shrink-0 self-center text-cheese opacity-0 transition-[opacity,rotate] duration-300 group-hover:rotate-45 group-hover:opacity-100" />
              </NavLink>
            </motion.li>
          ))}
        </ul>
      </nav>

      <motion.div
        initial={reduced ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: reduced ? 0 : 0.55, duration: 0.5 }}
        className="mt-auto space-y-4 pt-12"
      >
        <OpenBadge />
        <p className="flex items-center gap-2 font-semibold text-oat/85">
          <MapPin size={18} aria-hidden="true" /> {addressLine}
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Link to="/menu" onClick={onClose} className={buttonClasses('primary', 'lg', 'group')}>
            Order Now <ArrowUpRight aria-hidden="true" className="transition-[rotate] duration-300 group-hover:rotate-45" />
          </Link>
          <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-full px-2 font-bold text-oat underline decoration-cheese decoration-2 underline-offset-4">
            <InstagramIcon size={20} /> @{site.socials.instagram}
          </a>
        </div>
      </motion.div>
    </motion.div>
  )
}
