import { Link } from 'react-router'
import { site } from '@/config/site'
import { registerLogoClick } from '@/lib/easterEgg'
import { cn } from '@/lib/utils'
import { BrandImage } from '@/components/brand/BrandImage'

/** Navbar logo: icon + wordmark; the wordmark tucks away on scroll; icon wiggles on hover. */
export function NavLogo({ compact }: { compact: boolean }) {
  return (
    <Link
      to="/"
      onClick={() => registerLogoClick()}
      aria-label={`${site.brandName} home`}
      className="group inline-flex min-h-11 items-center gap-1.5 rounded-full pr-1"
    >
      <span className="group-hover:animate-wiggle">
        <BrandImage kind="icon" height={44} alt="" priority />
      </span>
      <span
        aria-hidden="true"
        className={cn(
          'overflow-hidden transition-[max-width,opacity] duration-500 ease-snappy',
          compact ? 'max-w-0 opacity-0' : 'max-w-40 opacity-100',
        )}
      >
        <BrandImage kind="wordmark" height={30} alt="" priority />
      </span>
    </Link>
  )
}
