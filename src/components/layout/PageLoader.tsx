import { MugMark } from './Logo'

/** Suspense fallback while a lazy route chunk loads. */
export function PageLoader() {
  return (
    <div className="flex min-h-[70dvh] items-center justify-center" role="status" aria-live="polite">
      <MugMark className="animate-wiggle size-16" />
      <span className="sr-only">Loading…</span>
    </div>
  )
}
