import { ShoppingBag } from 'lucide-react'
import { useCart, useCartCount } from '@/store/cart'
import { cn } from '@/lib/utils'
import { RollingNumber } from '@/components/ui/RollingNumber'

/**
 * Navbar cart button: opens the drawer, shows an odometer count.
 * `data-cart-target` = fly-to-cart landing spot; `data-cart-jelly` = element that jelly-bounces.
 */
export function CartButton({ className }: { className?: string }) {
  const count = useCartCount()
  const isOpen = useCart((s) => s.isOpen)
  const openCart = useCart((s) => s.openCart)
  const label = count === 0 ? 'Cart, empty' : `Cart, ${count} item${count === 1 ? '' : 's'}`

  return (
    <button
      type="button"
      onClick={openCart}
      data-cart-target
      aria-label={label}
      aria-haspopup="dialog"
      aria-expanded={isOpen}
      className={cn('group relative inline-flex size-12 items-center justify-center rounded-full', className)}
    >
      <span
        data-cart-jelly
        className="sticker flex size-12 items-center justify-center rounded-full bg-espresso text-oat transition-[rotate] duration-200 group-hover:-rotate-6"
      >
        <ShoppingBag size={22} strokeWidth={2.4} aria-hidden="true" />
      </span>
      <span
        aria-hidden="true"
        className={cn(
          'absolute -top-1.5 -right-1.5 flex h-6 min-w-6 items-center justify-center rounded-full border-2 border-espresso bg-cheese px-1 text-xs font-extrabold text-espresso',
          'transition-[scale] duration-300 ease-bouncy',
          count === 0 ? 'scale-0' : 'scale-100',
        )}
      >
        <RollingNumber value={Math.min(count, 99)} />
      </span>
      <span className="sr-only" aria-live="polite">
        {count > 0 ? `${count} item${count === 1 ? '' : 's'} in cart` : ''}
      </span>
    </button>
  )
}
