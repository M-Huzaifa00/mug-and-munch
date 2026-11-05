import { cn } from '@/lib/utils'

/** Hand-drawn curly arrow (points down-right by default). Paths carry `data-draw` for DrawSVG. */
export function HandArrow({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 120 90" className={cn('h-16 w-24 fill-none stroke-espresso', className)}>
      <path
        data-draw
        d="M6 10c22-6 46 0 52 16 6 15-12 22-18 12-6-11 12-22 30-14 15 7 24 24 30 46"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path data-draw d="M90 58l12 14 10-17" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
