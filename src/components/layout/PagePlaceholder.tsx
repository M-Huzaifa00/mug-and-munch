import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface PagePlaceholderProps {
  kicker: string
  title: string
  emoji: string
  phase: number
  className?: string
  children?: ReactNode
}

/** Temporary page body for routes that get built in later phases. */
export function PagePlaceholder({ kicker, title, emoji, phase, className, children }: PagePlaceholderProps) {
  return (
    <section className={cn('grain bg-oat px-4 pt-32 pb-24 sm:px-6', className)}>
      <div className="mx-auto max-w-5xl">
        <p className="font-hand text-3xl text-ink">{kicker}</p>
        <h1 className="text-display mt-2 font-extrabold text-espresso">
          {title} <span aria-hidden="true">{emoji}</span>
        </h1>
        <p className="sticker mt-8 inline-block rounded-full bg-cheese px-4 py-2 text-sm font-bold text-espresso">
          Being cooked in Phase {phase}
        </p>
        {children}
      </div>
    </section>
  )
}
