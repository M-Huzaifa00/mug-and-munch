import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * Text that rolls up to an identical copy on hover / focus (CSS only). The PARENT needs `group`.
 * The copy is aria-hidden so screen readers hear the label once. Reduced motion: no roll.
 */
export function RollText({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn('relative inline-flex overflow-hidden', className)}>
      <span className="transition-[translate] duration-500 ease-snappy group-hover:-translate-y-full group-focus-visible:-translate-y-full motion-reduce:transition-none">
        {children}
      </span>
      <span
        aria-hidden="true"
        className="absolute inset-0 translate-y-full transition-[translate] duration-500 ease-snappy group-hover:translate-y-0 group-focus-visible:translate-y-0 motion-reduce:transition-none"
      >
        {children}
      </span>
    </span>
  )
}
