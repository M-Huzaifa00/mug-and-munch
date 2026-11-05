import type { CSSProperties } from 'react'
import { cn } from '@/lib/utils'

export type StickerKind = 'sparkle' | 'hot' | 'steam' | 'new' | 'star'

interface StickerProps {
  kind: StickerKind
  className?: string
  /** Idle tilt in degrees (used by the float loop). */
  tilt?: number
}

/** Decorative doodle stickers. Always aria-hidden; position with className. */
export function Sticker({ kind, className, tilt = 8 }: StickerProps) {
  const style = { '--r': `${tilt}deg` } as CSSProperties
  const base = cn('pointer-events-none absolute animate-float select-none', className)

  if (kind === 'hot' || kind === 'new') {
    return (
      <span
        aria-hidden="true"
        style={style}
        className={cn(
          base,
          'sticker rounded-full px-3 py-1 font-display text-sm font-extrabold text-espresso uppercase',
          kind === 'hot' ? 'bg-chili' : 'bg-bubblegum',
        )}
      >
        {kind === 'hot' ? '🔥 hot' : 'NEW!'}
      </span>
    )
  }

  if (kind === 'steam') {
    return (
      <svg aria-hidden="true" viewBox="0 0 60 80" style={style} className={cn(base, 'h-16 w-12 fill-none stroke-espresso')}>
        <path d="M18 76c-10-12 10-18 0-30s10-18 0-30" strokeWidth="4" strokeLinecap="round" />
        <path d="M40 76c-10-12 10-18 0-30s10-18 0-30" strokeWidth="4" strokeLinecap="round" className="stroke-caramel" />
      </svg>
    )
  }

  // sparkle / star
  return (
    <svg aria-hidden="true" viewBox="0 0 64 64" style={style} className={cn(base, 'size-12')}>
      {kind === 'sparkle' ? (
        <path
          d="M32 4c2 16 8 24 28 28-20 4-26 12-28 28-2-16-8-24-28-28 20-4 26-12 28-28z"
          className="fill-oat stroke-espresso"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M32 6l7.6 16.4L58 25l-13.4 12.6L48 56 32 47 16 56l3.4-18.4L6 25l18.4-2.6z"
          className="fill-cheese stroke-espresso"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
      )}
    </svg>
  )
}
