import { Link } from 'react-router'
import { site } from '@/config/site'
import { cn } from '@/lib/utils'

/** Tiny Munchy-style mug mark used in the logo (full mascot lives in components/mascot). */
export function MugMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={cn('size-10', className)} aria-hidden="true">
      <path d="M17 9q-2-3 0-6M25 9q-2-3 0-6" className="animate-steam fill-none stroke-caramel" strokeWidth="2.5" strokeLinecap="round" />
      <path
        d="M8 13h26v17a11 11 0 0 1-11 11h-4A11 11 0 0 1 8 30z"
        className="fill-cheese stroke-espresso"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path d="M34 18h3a5.5 5.5 0 0 1 0 11h-3" className="fill-none stroke-espresso" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="16.5" cy="24" r="2.2" className="fill-espresso" />
      <circle cx="25.5" cy="24" r="2.2" className="fill-espresso" />
      <path d="M17.5 30q3.5 3 7 0" className="fill-none stroke-espresso" strokeWidth="2.3" strokeLinecap="round" />
    </svg>
  )
}

export function Logo({ className, onClick }: { className?: string; onClick?: () => void }) {
  return (
    <Link
      to="/"
      onClick={onClick}
      className={cn('group inline-flex min-h-11 items-center gap-2 rounded-full pr-2', className)}
      aria-label={`${site.name} home`}
    >
      <MugMark className="transition-transform duration-300 ease-bouncy group-hover:-rotate-12" />
      <span className="font-display text-xl leading-none font-extrabold tracking-tighter text-espresso sm:text-2xl">
        Mug <span className="text-chili">&amp;</span> Munch
      </span>
    </Link>
  )
}
