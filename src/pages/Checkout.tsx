import { useEffect, useState } from 'react'
import { FormProvider } from 'react-hook-form'
import { site } from '@/config/site'
import { track } from '@/lib/events'
import { getOpenStatus } from '@/lib/hours'
import { notify } from '@/lib/notify'
import { getPickupPlan } from '@/lib/pickupSlots'
import { isWhatsappConfigured } from '@/lib/whatsapp'
import { formatPKR } from '@/lib/utils'
import { useCart, useOrderTotals } from '@/store/cart'
import { Seo } from '@/components/layout/Seo'
import { FreeDeliveryBar } from '@/components/layout/cart/FreeDeliveryBar'
import { CheckoutBanners } from '@/components/checkout/CheckoutBanners'
import { CheckoutCard } from '@/components/checkout/CheckoutCard'
import { CheckoutEmpty } from '@/components/checkout/CheckoutEmpty'
import { CheckoutTotals } from '@/components/checkout/CheckoutTotals'
import { DetailsFields } from '@/components/checkout/DetailsFields'
import { ErrorSummary } from '@/components/checkout/ErrorSummary'
import { MessagePreview } from '@/components/checkout/MessagePreview'
import { OrderReview } from '@/components/checkout/OrderReview'
import { OrderTypeFields } from '@/components/checkout/OrderTypeFields'
import { OrderTypeSwitch } from '@/components/checkout/OrderTypeSwitch'
import { PaymentOptions } from '@/components/checkout/PaymentOptions'
import { SendOrderButton } from '@/components/checkout/SendOrderButton'
import { useCheckoutForm } from '@/components/checkout/useCheckoutForm'
import { useSendOrder } from '@/components/checkout/useSendOrder'

const CONFIGURED = isWhatsappConfigured()

/** /checkout: 1 How · 2 Details · 3 Payment · 4 Review → "Send order on WhatsApp". No fake order flow. */
export function Checkout() {
  const items = useCart((s) => s.items)
  const totals = useOrderTotals()
  const form = useCheckoutForm()
  const [plan] = useState(() => getPickupPlan())
  const [status] = useState(() => getOpenStatus())
  const { send, problems, preview, closePreview } = useSendOrder(form, plan)
  const orderType = form.watch('orderType')
  const pickupTime = form.watch('pickupTime')

  // Re-price persisted lines on arrival (one honest notice) + analytics.
  useEffect(() => {
    if (useCart.getState().reprice()) notify('Some prices were updated.', { id: 'prices-updated' })
    const n = useCart.getState().items.length
    if (n > 0) track('begin_checkout', { items: n })
  }, [])

  // Keep the pickup time valid for the current plan (e.g. ASAP isn't offered while closed).
  useEffect(() => {
    if (orderType === 'takeaway' && !plan.slots.some((s) => s.value === pickupTime)) form.setValue('pickupTime', plan.slots[0]?.value ?? '')
  }, [orderType, pickupTime, plan, form])

  const seo = <Seo title="Checkout" description={`Send your ${site.brandName} order on WhatsApp: delivery, takeaway or dine-in.`} path="/checkout" />
  if (items.length === 0) {
    return (
      <>
        {seo}
        <CheckoutEmpty />
      </>
    )
  }

  const unavailable = items.some((i) => i.unavailable)
  const belowMin = orderType === 'delivery' && totals.belowMinimum
  const disabledReason = unavailable ? 'Remove the items that are no longer available first.' : belowMin ? `Delivery starts at ${formatPKR(site.commerce.minDeliveryOrder)}.` : undefined
  const cta = (idSuffix: string, className?: string) => (
    <SendOrderButton total={totals.total} onSend={send} disabled={unavailable || belowMin} disabledReason={disabledReason} configured={CONFIGURED} idSuffix={idSuffix} className={className} />
  )

  return (
    <FormProvider {...form}>
      {seo}
      <div className="grain bg-oat px-4 pt-24 pb-44 sm:px-6 md:pt-28 lg:pb-20">
        <div className="mx-auto max-w-6xl">
          <p className="-rotate-2 font-hand text-2xl text-chili">almost there…</p>
          <h1 className="text-display font-extrabold text-espresso">Checkout</h1>

          <form noValidate onSubmit={(e) => (e.preventDefault(), send())} className="mt-6 grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_400px]">
            <div className="space-y-5">
              {problems && <ErrorSummary errors={form.formState.errors} extra={problems} />}
              <CheckoutBanners status={status} configured={CONFIGURED} />

              <CheckoutCard step={1} title="How do you want it?" id="co-how">
                <OrderTypeSwitch
                  value={orderType}
                  onChange={(t) => {
                    form.setValue('orderType', t, { shouldDirty: true })
                    track('checkout_step', { step: 'order_type', orderType: t })
                  }}
                />
                <OrderTypeFields plan={plan} belowMinimum={belowMin} />
              </CheckoutCard>

              <CheckoutCard step={2} title="Your details" id="co-details">
                <DetailsFields />
              </CheckoutCard>

              <CheckoutCard step={3} title="Payment" id="co-pay">
                <PaymentOptions />
              </CheckoutCard>
            </div>

            <CheckoutCard step={4} title="Review your order" id="co-review" className="lg:sticky lg:top-24 lg:col-start-2 lg:row-span-3 lg:row-start-1">
              <OrderReview />
              <FreeDeliveryBar className="mt-4" />
              <div className="mt-4">
                <CheckoutTotals totals={totals} orderType={orderType} />
              </div>
              {cta('desktop', 'mt-4 max-lg:hidden')}
            </CheckoutCard>
          </form>

          {preview && <MessagePreview text={preview} onClose={closePreview} />}
        </div>
      </div>

      {/* Mobile / tablet sticky CTA (above the tab bar on phones). */}
      <div className="glass fixed inset-x-0 bottom-[calc(4rem+3px+env(safe-area-inset-bottom))] z-40 border-t-[2.5px] border-espresso px-3 pt-2.5 pb-2 md:bottom-0 md:pb-[calc(0.5rem+env(safe-area-inset-bottom))] lg:hidden">
        {cta('mobile')}
      </div>
    </FormProvider>
  )
}
