import { NavLink } from 'react-router'
import { useScrollState } from '@/hooks/useScrollState'
import { cn } from '@/lib/utils'
import { ButtonLink } from '@/components/ui/Button'
import { CartButton } from './CartButton'
import { NavLogo } from './NavLogo'
import { NAV_LINKS } from './navLinks'

/**
 * Sticky glassy navbar: shrinks after a little scroll, hides on scroll down, returns on scroll up.
 * Pure CSS transforms (UI state), no GSAP/Motion needed.
 */
export function Navbar() {
  const { scrolled, hidden } = useScrollState()

  return (
    <header
      data-nav-header
      className={cn(
        'fixed inset-x-0 top-0 z-50 px-3 transition-[translate,padding] duration-500 ease-snappy sm:px-5',
        scrolled ? 'pt-2' : 'pt-3 sm:pt-5',
        hidden ? '-translate-y-[120%]' : 'translate-y-0',
      )}
    >
      <nav
        aria-label="Main"
        className={cn(
          'mx-auto flex max-w-7xl items-center justify-between gap-3 rounded-full border-[2.5px] px-3 transition-all duration-500 ease-snappy sm:px-4',
          scrolled ? 'glass border-espresso py-1.5 shadow-hard' : 'border-transparent py-2.5',
        )}
      >
        <NavLogo compact={scrolled} />

        <ul className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    'inline-flex min-h-11 items-center rounded-full px-4 font-semibold text-espresso transition-colors duration-200',
                    isActive ? 'bg-cheese' : 'hover:bg-espresso hover:text-oat',
                  )
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2 sm:gap-3">
          <ButtonLink to="/menu" size="md" className="hidden md:inline-flex">
            Order Now
          </ButtonLink>
          <CartButton />
        </div>
      </nav>
    </header>
  )
}
