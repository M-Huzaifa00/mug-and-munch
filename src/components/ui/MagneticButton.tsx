import { useRef, type ReactNode } from 'react'
import { useMagnetic } from '@/hooks/useMagnetic'
import { cn } from '@/lib/utils'

/** Wraps any button/link so it gets pulled toward the cursor (desktop only). */
export function MagneticButton({ children, strength, className }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  useMagnetic(ref, strength)
  return (
    <span ref={ref} className={cn('inline-block', className)}>
      {children}
    </span>
  )
}
