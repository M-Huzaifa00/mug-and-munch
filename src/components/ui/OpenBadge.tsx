import { useEffect, useState } from 'react'
import { getOpenStatus, type OpenStatus } from '@/lib/hours'
import { cn } from '@/lib/utils'

/** Live "Open now / Closed" pill computed in Asia/Karachi time; refreshes every minute. */
export function OpenBadge({ className }: { className?: string }) {
  const [status, setStatus] = useState<OpenStatus>(() => getOpenStatus())

  useEffect(() => {
    const id = window.setInterval(() => setStatus(getOpenStatus()), 60_000)
    return () => window.clearInterval(id)
  }, [])

  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border-2 border-espresso px-3 py-1 text-sm font-bold whitespace-nowrap text-espresso',
        status.isOpen ? 'bg-pickle' : 'bg-bubblegum',
        className,
      )}
    >
      {status.label}
    </span>
  )
}
