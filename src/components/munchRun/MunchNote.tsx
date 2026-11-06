import { cn } from '@/lib/utils'
import { HandArrow } from '@/components/ui/HandArrow'

/** Caveat note + hand-drawn arrow beside the parked character (md+ only; hidden until a stop shows it). */
export function MunchNote({ id, text, side }: { id: string; text: string; side: 'left' | 'right' }) {
  return (
    <p
      data-mr={id}
      className={cn(
        'invisible absolute top-[-6%] hidden items-start gap-0 font-hand text-2xl whitespace-nowrap text-espresso opacity-0 md:flex lg:text-[1.75rem]',
        side === 'left' ? 'right-[92%] flex-row' : 'left-[92%] flex-row-reverse',
      )}
    >
      <span className={cn('-mt-1 rounded-full bg-oat/80 px-2 py-0.5', side === 'left' ? '-rotate-3' : 'rotate-3')}>{text}</span>
      <HandArrow className={cn('mt-3 h-10 w-14 shrink-0', side === 'left' ? '' : '-scale-x-100')} />
    </p>
  )
}
