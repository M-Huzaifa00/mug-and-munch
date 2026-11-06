import { useFormContext } from 'react-hook-form'
import { site } from '@/config/site'
import { PAYMENT_METHODS, paymentLabel, type CheckoutForm, type PaymentMethod } from '@/lib/checkoutSchema'
import { cn } from '@/lib/utils'

const NOTE: Record<PaymentMethod, string> = {
  cod: 'Pay when your food is in your hands.',
  jazzcash: 'Mobile wallet',
  easypaisa: 'Mobile wallet',
  card: 'Debit / credit card',
}

/**
 * Payment radio cards (text badges, no copied logos). Cash is the only live method for now; the others
 * show "Coming soon" and are aria-disabled. TODO(payments): gateway integration (needs the backend).
 */
export function PaymentOptions() {
  const { register, watch } = useFormContext<CheckoutForm>()
  const orderType = watch('orderType')
  const chosen = watch('payment')
  const anyDisabled = PAYMENT_METHODS.some((m) => !site.payments[m])

  return (
    <fieldset>
      <legend className="sr-only">Payment method</legend>
      <div className="grid gap-2 sm:grid-cols-2">
        {PAYMENT_METHODS.map((m) => {
          const enabled = site.payments[m]
          const label = paymentLabel(m, orderType)
          return (
            <label
              key={m}
              className={cn(
                'relative flex min-h-16 items-center gap-3 rounded-2xl border-[2.5px] border-espresso px-3 py-2 has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-cheese',
                enabled ? 'cursor-pointer bg-oat shadow-hard-sm' : 'cursor-not-allowed border-dashed bg-espresso/5',
                enabled && chosen === m && 'bg-cheese',
              )}
            >
              <input
                type="radio"
                id={`co-payment-${m}`}
                value={m}
                {...register('payment')}
                disabled={!enabled}
                aria-disabled={!enabled || undefined}
                aria-describedby={!enabled ? 'co-payment-soon' : undefined}
                className="size-5 shrink-0 accent-chili"
              />
              <span className="min-w-0 flex-1">
                <span className={cn('block font-extrabold text-espresso', !enabled && 'opacity-60')}>{label}</span>
                <span className="block text-xs font-semibold text-ink/75">{NOTE[m]}</span>
              </span>
              {!enabled && <span className="shrink-0 rounded-full border-2 border-espresso bg-bubblegum px-2 py-0.5 text-[0.6875rem] font-extrabold text-espresso">Coming soon</span>}
            </label>
          )
        })}
      </div>
      {anyDisabled && (
        <p id="co-payment-soon" className="mt-2 text-sm font-semibold text-ink/80">
          Pay cash for now. Online payments are coming soon.
        </p>
      )}
    </fieldset>
  )
}
