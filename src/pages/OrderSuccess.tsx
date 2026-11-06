import { useEffect, useState } from 'react'
import { site } from '@/config/site'
import { confettiBurst } from '@/lib/celebrate'
import { track } from '@/lib/events'
import { loadLastOrder, saveLastOrder, type Order } from '@/lib/order'
import { getWhatsAppOrderUrl, whatsappAboutOrderLink } from '@/lib/whatsapp'
import { useCart } from '@/store/cart'
import { Button, ButtonLink } from '@/components/ui/Button'
import { buttonClasses } from '@/components/ui/buttonClasses'
import { Logo } from '@/components/brand/Logo'
import { Seo } from '@/components/layout/Seo'
import { Mascot } from '@/components/mascot/Mascot'
import { OrderSnapshot } from '@/components/checkout/OrderSnapshot'
import { clearCheckoutDraft } from '@/components/checkout/useCheckoutForm'

const confettiKey = (n: string) => `mm-confetti-${n}`

/**
 * After the WhatsApp CTA. Never claims the order is confirmed or received: only the owner confirms, on WhatsApp.
 * pending-send → "Almost done! Hit send…" · sent → thanks + ETA (estimated, after confirmation) · none → fallback.
 */
export function OrderSuccess() {
  const [order, setOrder] = useState<Order | null>(loadLastOrder)

  // One confetti burst per order number, once it's marked sent.
  useEffect(() => {
    if (order?.status !== 'sent') return
    try {
      if (sessionStorage.getItem(confettiKey(order.number))) return
      sessionStorage.setItem(confettiKey(order.number), '1')
    } catch {
      /* no storage: still celebrate once per mount */
    }
    void confettiBurst(window.innerWidth / 2, window.innerHeight * 0.3)
  }, [order])

  const markSent = () => {
    if (!order) return
    const sent: Order = { ...order, status: 'sent' }
    saveLastOrder(sent)
    useCart.getState().clear()
    clearCheckoutDraft()
    track('order_sent_confirmed', { orderNumber: order.number, total: order.totals.total })
    setOrder(sent)
  }

  const seo = <Seo title="Your order" description={`Send your ${site.brandName} order on WhatsApp and we'll confirm it there.`} path="/order-success" />

  if (!order) {
    return (
      <>
        {seo}
        <section className="grain flex min-h-[80dvh] flex-col items-center justify-center bg-oat px-4 pt-28 pb-16 text-center">
          <Mascot mood="idle" className="h-48" label="Munchy waiting" />
          <h1 className="text-display mt-4 font-extrabold text-espresso">No order here yet</h1>
          <p className="mt-2 text-ink">Bhook lagi? Pick something tasty and send it to us on WhatsApp.</p>
          <ButtonLink to="/menu" size="lg" className="mt-6">
            See the menu
          </ButtonLink>
        </section>
      </>
    )
  }

  const [lo, hi] = site.etaMinutes[order.orderType]
  const waRetry = getWhatsAppOrderUrl(order)
  const waAbout = whatsappAboutOrderLink(order.number)
  const pending = order.status === 'pending-send'

  return (
    <>
      {seo}
      <section className={`grain flex min-h-[80dvh] flex-col items-center px-4 pt-28 pb-16 text-center ${pending ? 'bg-cheese' : 'bg-pickle'}`}>
        <div className="flex items-end gap-4">
          <Mascot mood={pending ? 'excited' : 'dance'} className="h-44" label={pending ? 'Munchy waiting excitedly' : 'Munchy doing a happy dance'} />
          <Logo variant="icon" size={88} tone="light" alt="" className="rotate-6" />
        </div>
        <p className="mt-5 rounded-full border-2 border-espresso bg-oat px-4 py-1 font-display font-extrabold text-espresso">Order {order.number}</p>

        {pending ? (
          <>
            <h1 className="text-display mt-3 max-w-2xl font-extrabold text-espresso">Almost done!</h1>
            <p className="mt-2 max-w-md text-lg font-semibold text-espresso">Hit send on WhatsApp and we'll confirm your order there.</p>
            <Button size="lg" onClick={markSent} className="mt-6">
              Yes, I've sent it
            </Button>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm font-bold text-espresso">
              {waRetry && (
                <a href={waRetry} target="_blank" rel="noopener" className="inline-flex min-h-11 items-center underline decoration-2 underline-offset-2">
                  WhatsApp didn't open? Try again
                </a>
              )}
              <ButtonLink to="/checkout" variant="ghost" size="sm" className="underline decoration-2 underline-offset-2">
                Edit order
              </ButtonLink>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-display mt-3 max-w-2xl font-extrabold text-espresso">Shukriya!</h1>
            <p className="mt-2 max-w-md text-lg font-semibold text-espresso">We'll confirm on WhatsApp shortly, then it's garma garam on the way.</p>
            <p className="mt-3 rounded-2xl border-2 border-espresso bg-oat px-4 py-2 text-sm font-bold text-espresso">
              {order.details.orderType === 'takeaway' && `Usually ready in ~${lo}–${hi} min at the counter`}
              {order.details.orderType === 'dineIn' && `Table ${order.details.table}, coming right up after we confirm (~${lo}–${hi} min)`}
              {order.details.orderType === 'delivery' && `~${lo}–${hi} min to your door`}
              <span className="block text-xs font-semibold text-ink/75">estimated, after confirmation</span>
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {waAbout && (
                <a href={waAbout} target="_blank" rel="noopener noreferrer" className={buttonClasses('outline', 'md')}>
                  Questions? WhatsApp us
                </a>
              )}
              <ButtonLink to="/menu" size="md">
                Back to menu
              </ButtonLink>
            </div>
          </>
        )}

        <details className="mt-8 w-full max-w-lg rounded-3xl border-[2.5px] border-espresso bg-oat p-4 shadow-hard" open={pending}>
          <summary className="min-h-11 cursor-pointer content-center font-display text-lg font-extrabold text-espresso">Order summary</summary>
          <div className="mt-3">
            <OrderSnapshot order={order} />
          </div>
        </details>
      </section>
    </>
  )
}
