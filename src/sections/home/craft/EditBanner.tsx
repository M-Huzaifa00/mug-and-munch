import { useCart } from '@/store/cart'

/** "Editing your cart item" note above the maker CTA, with a way out. */
export function EditBanner() {
  const stopEditing = useCart((s) => s.stopEditing)
  return (
    <p role="status" className="mt-5 flex flex-wrap items-center gap-x-2 rounded-2xl border-2 border-cheese bg-cheese/15 px-3 py-2 text-sm font-bold text-oat">
      ✏️ Editing the one in your cart. Update replaces it.
      <button type="button" onClick={stopEditing} className="min-h-11 font-extrabold text-cheese underline decoration-2 underline-offset-2">
        Cancel edit
      </button>
    </p>
  )
}
