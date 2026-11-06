import { BrandImage } from '@/components/brand/BrandImage'

/** Suspense fallback while a maker chunk loads (only rendered for the active tab). */
export function MakerLoading({ show }: { show: boolean }) {
  if (!show) return null
  return (
    <div className="flex items-center justify-center [grid-area:stage] max-md:h-[40vh] md:h-[440px]" role="status">
      <BrandImage kind="icon" height={80} alt="" className="animate-pulse" />
      <span className="sr-only">Loading…</span>
    </div>
  )
}
