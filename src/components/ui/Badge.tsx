import type { Badge as BadgeKind } from '@/data/menu'
import { cn } from '@/lib/utils'

const STYLES: Record<BadgeKind, { label: string; cls: string }> = {
  bestseller: { label: '⭐ Bestseller', cls: 'bg-cheese' },
  new: { label: 'New', cls: 'bg-bubblegum' },
  spicy: { label: '🌶️ Spicy', cls: 'bg-chili' },
  veg: { label: '🌱 Veg', cls: 'bg-pickle' },
}

/** Item badge pill. Espresso text on every colour (all pass AA). */
export function Badge({ kind, className }: { kind: BadgeKind; className?: string }) {
  const s = STYLES[kind]
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border-2 border-espresso px-2 py-0.5 text-[0.6875rem] leading-tight font-extrabold tracking-wide text-espresso uppercase',
        s.cls,
        className,
      )}
    >
      {s.label}
    </span>
  )
}
