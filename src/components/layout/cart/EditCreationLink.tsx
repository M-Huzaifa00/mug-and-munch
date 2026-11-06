import { Link } from 'react-router'
import { Pencil } from 'lucide-react'
import type { LineDescription } from '@/lib/lineDescription'
import { cn } from '@/lib/utils'
import { useCart } from '@/store/cart'

/**
 * "Edit" (custom burger / wrap) or "Tweak" (coffee): opens Home #craft-<tab> with this line preloaded;
 * the maker's CTA then replaces the line instead of adding a duplicate.
 */
export function EditCreationLink({ lineId, edit, title, className }: { lineId: string; edit: NonNullable<LineDescription['edit']>; title: string; className?: string }) {
  const startEditing = useCart((s) => s.startEditing)
  return (
    <Link
      to={`/#craft-${edit.tab}`}
      onClick={() => startEditing({ lineId, tab: edit.tab })}
      aria-label={`${edit.label} ${title}`}
      className={cn('inline-flex min-h-11 items-center gap-1 rounded-full px-2 text-xs font-extrabold text-espresso underline decoration-2 underline-offset-2 hover:bg-cheese/40', className)}
    >
      <Pencil size={13} aria-hidden="true" /> {edit.label}
    </Link>
  )
}
