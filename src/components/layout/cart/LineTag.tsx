import { cn } from '@/lib/utils'
import type { LineKind } from '@/lib/lineDescription'

/** Category-coloured tag fills; small text is always espresso (contrast rules). */
const TONE: Partial<Record<LineKind, string>> = {
  burger: 'bg-chili',
  wrap: 'bg-pickle',
  deal: 'bg-cheese',
}

/** Sticker chip for custom lines + deals ("Custom burger 🍔", "Deal"). */
export function LineTag({ kind, tag, className }: { kind: LineKind; tag?: string; className?: string }) {
  if (!tag) return null
  return (
    <span className={cn('inline-block -rotate-2 rounded-full border-2 border-espresso px-2 py-0.5 text-[0.6875rem] leading-none font-extrabold text-espresso', TONE[kind] ?? 'bg-bubblegum', className)}>
      {tag}
    </span>
  )
}
