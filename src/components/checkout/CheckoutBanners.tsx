import type { OpenStatus } from '@/lib/hours'

/** Honest "closed" note (no urgency) + the dev-only placeholder-number warning. */
export function CheckoutBanners({ status, configured }: { status: OpenStatus; configured: boolean }) {
  return (
    <>
      {!configured && import.meta.env.DEV && (
        <p role="note" className="rounded-2xl border-[2.5px] border-dashed border-espresso bg-bubblegum/40 px-4 py-3 text-sm font-bold text-espresso">
          DEV: WhatsApp number in site.ts is still a placeholder; orders won't reach anyone. The send button only opens a preview below.
        </p>
      )}
      {!status.isOpen && (
        <p role="status" className="rounded-2xl border-[2.5px] border-espresso bg-cheese/50 px-4 py-3 font-bold text-espresso">
          😴 We're closed right now{status.detail ? `, ${status.detail}` : ''}. You can still send your order; we'll confirm it when we open.
        </p>
      )}
    </>
  )
}
