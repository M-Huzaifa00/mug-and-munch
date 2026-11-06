import { BrandImage } from '@/components/brand/BrandImage'

/** Suspense fallback while a lazy route chunk loads: pulsing logo. */
export function PageLoader() {
  return (
    <div className="flex min-h-[70dvh] items-center justify-center" role="status" aria-live="polite">
      <BrandImage kind="icon" height={96} alt="" className="animate-pulse" />
      <span className="sr-only">Loading…</span>
    </div>
  )
}
