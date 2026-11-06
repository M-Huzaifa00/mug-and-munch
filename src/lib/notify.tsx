import { toast } from 'sonner'
import { brandSrc } from './brand'

interface NotifyOptions {
  /** Same id replaces the previous toast instead of stacking. */
  id?: string
  undo?: () => void
  duration?: number
}

const icon = <img src={brandSrc('icon', 64)} alt="" width={22} height={27} className="h-[27px] w-[22px]" />

/** Branded toast (logo icon + optional Undo). Use instead of calling sonner directly. */
export function notify(message: string, { id, undo, duration = 4000 }: NotifyOptions = {}) {
  toast(message, {
    id,
    duration,
    icon,
    action: undo ? { label: 'Undo', onClick: undo } : undefined,
  })
}
