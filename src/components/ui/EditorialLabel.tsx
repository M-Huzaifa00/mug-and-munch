import { cn } from '@/lib/utils'

/** Editorial section label, e.g. "( 01 ) — The combos" with a hairline after it (decorative numbering). */
export function EditorialLabel({ index, children, className }: { index: number; children: string; className?: string }) {
  return (
    <p className={cn('flex items-center gap-3 font-sans text-xs font-bold tracking-[0.3em] uppercase', className)}>
      <span aria-hidden="true">( {String(index).padStart(2, '0')} )</span>
      <span aria-hidden="true">—</span>
      <span>{children}</span>
      <span aria-hidden="true" className="h-px min-w-8 flex-1 bg-current opacity-30" />
    </p>
  )
}
