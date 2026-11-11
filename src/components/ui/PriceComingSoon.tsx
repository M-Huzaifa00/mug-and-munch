import { cn } from '@/lib/utils'

/** Shown instead of a price (and instead of "Add") while the owner hasn't set one (`price: null` in data/menu.ts). */
export function PriceComingSoon({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border-2 border-espresso bg-cheese px-2.5 py-0.5 text-[0.6875rem] leading-tight font-extrabold tracking-wide whitespace-nowrap text-espresso uppercase',
        className,
      )}
    >
      Price coming soon
    </span>
  )
}
