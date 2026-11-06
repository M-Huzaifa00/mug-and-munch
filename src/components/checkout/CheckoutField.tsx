import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface CheckoutFieldProps {
  id: string
  label: string
  optional?: boolean
  hint?: ReactNode
  error?: string
  className?: string
  children: ReactNode
}

/** Label + control + hint + error. The control must set aria-describedby={`${id}-hint ${id}-error`} itself. */
export function CheckoutField({ id, label, optional, hint, error, className, children }: CheckoutFieldProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <label htmlFor={id} className="block text-sm font-extrabold text-espresso">
        {label} {optional && <span className="font-semibold text-ink/70">(optional)</span>}
      </label>
      {children}
      {hint && (
        <p id={`${id}-hint`} className="text-xs font-semibold text-ink/75">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-sm font-bold text-espresso">
          <span aria-hidden="true">⚠️ </span>
          {error}
        </p>
      )}
    </div>
  )
}

