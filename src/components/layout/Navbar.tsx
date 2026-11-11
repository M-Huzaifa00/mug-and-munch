import { useCallback, useState } from 'react'
import { AnimatePresence } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router'
import { useScrollState } from '@/hooks/useScrollState'
import { cn } from '@/lib/utils'
import { buttonClasses } from '@/components/ui/buttonClasses'
import { CartButton } from './CartButton'
import { NavLogo } from './NavLogo'
import { MenuOverlay } from './nav/MenuOverlay'
import { MenuToggle } from './nav/MenuToggle'
import { NavLinksPill } from './nav/NavLinksPill'

/**
 * Floating "islands" navbar: logo (left; turns into a glass sticker + tucks its wordmark on scroll),
 * link pill (centre, ≥1024px: numbered links that roll, one gliding blob), Order Now ↗ + cart (right).
 * Below 1024px: logo + cart + a menu button that opens a full-screen menu (circle wipe). Hides on scroll
 * down, returns on scroll up (CSS transforms only).
 */
export function Navbar() {
  const { scrolled, hidden } = useScrollState()
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = useCallback(() => setMenuOpen(false), [])

  return (
    <>
      <header
        data-nav-header
        className={cn(
          'fixed inset-x-0 top-0 z-50 px-3 transition-[translate,padding] duration-500 ease-snappy sm:px-5',
          scrolled ? 'pt-2' : 'pt-3 sm:pt-5',
          hidden && !menuOpen ? '-translate-y-[130%]' : 'translate-y-0',
        )}
      >
        <nav aria-label="Main" className="mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-3">
          <div
            className={cn(
              'justify-self-start rounded-full border-[2.5px] px-1.5 transition-[background-color,border-color,box-shadow] duration-500 ease-snappy',
              scrolled ? 'glass border-espresso shadow-hard' : 'border-transparent',
            )}
          >
            <NavLogo compact={scrolled} />
          </div>

          <div className="hidden lg:block">
            <NavLinksPill />
          </div>

          <div className="col-start-3 flex items-center gap-2 justify-self-end sm:gap-3">
            <Link to="/menu" className={buttonClasses('primary', 'md', 'group hidden lg:inline-flex')}>
              Order Now
              <ArrowUpRight size={20} strokeWidth={2.8} aria-hidden="true" className="transition-[rotate] duration-300 ease-bouncy group-hover:rotate-45" />
            </Link>
            <CartButton />
            <MenuToggle open={menuOpen} onToggle={() => setMenuOpen((o) => !o)} className="lg:hidden" />
          </div>
        </nav>
      </header>
      <AnimatePresence>{menuOpen && <MenuOverlay key="site-menu" onClose={closeMenu} />}</AnimatePresence>
    </>
  )
}
