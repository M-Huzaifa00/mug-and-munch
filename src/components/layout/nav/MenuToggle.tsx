import { cn } from '@/lib/utils'

interface MenuToggleProps {
  open: boolean
  onToggle: () => void
  className?: string
  /** Dark surface (inside the overlay) → oat button. */
  onDark?: boolean
}

/** Two bars that morph into an ✕ (CSS transitions only). */
export function MenuToggle({ open, onToggle, className, onDark }: MenuToggleProps) {
  const bar = 'absolute h-[2.5px] w-5 rounded-full transition-[translate,rotate] duration-300 ease-snappy'
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      aria-controls="site-menu"
      aria-label={open ? 'Close menu' : 'Open menu'}
      className={cn(
        'sticker relative flex size-12 shrink-0 items-center justify-center rounded-full transition-[rotate] duration-300 hover:-rotate-6',
        onDark ? 'bg-cheese' : 'bg-oat',
        className,
      )}
    >
      <span aria-hidden="true" className={cn(bar, 'bg-espresso', open ? 'rotate-45' : '-translate-y-1')} />
      <span aria-hidden="true" className={cn(bar, 'bg-espresso', open ? '-rotate-45' : 'translate-y-1')} />
    </button>
  )
}
