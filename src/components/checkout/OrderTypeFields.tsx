import { AnimatePresence, motion } from 'motion/react'
import { useFormContext } from 'react-hook-form'
import { site } from '@/config/site'
import type { CheckoutForm } from '@/lib/checkoutSchema'
import type { PickupPlan } from '@/lib/pickupSlots'
import { FADE_UP } from '@/lib/motion-presets'
import { formatPKR } from '@/lib/utils'
import { CheckoutField } from './CheckoutField'
import { describedBy, FIELD_ID, INPUT } from './fieldStyles'

const TABLES = Array.from({ length: site.tableCount }, (_, i) => String(i + 1))

/** Fields for the chosen order type; they animate in/out (AnimatePresence + layout). */
export function OrderTypeFields({ plan, belowMinimum }: { plan: PickupPlan; belowMinimum: boolean }) {
  const { register, watch, formState } = useFormContext<CheckoutForm>()
  const type = watch('orderType')
  const e = formState.errors

  return (
    <motion.div layout className="mt-4">
      <AnimatePresence mode="wait" initial={false}>
        {type === 'delivery' && (
          <motion.div key="delivery" {...FADE_UP} className="grid gap-4 sm:grid-cols-2">
            <CheckoutField id={FIELD_ID.area} label="Area" error={e.area?.message}>
              <select id={FIELD_ID.area} {...register('area')} aria-invalid={Boolean(e.area)} aria-describedby={describedBy(FIELD_ID.area, false, Boolean(e.area))} className={INPUT}>
                <option value="">Pick your area…</option>
                {site.deliveryAreas.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </CheckoutField>
            <CheckoutField id={FIELD_ID.address} label="House / street address" error={e.address?.message}>
              <input id={FIELD_ID.address} {...register('address')} autoComplete="street-address" enterKeyHint="next" placeholder="House 12, Street 34" aria-invalid={Boolean(e.address)} aria-describedby={describedBy(FIELD_ID.address, false, Boolean(e.address))} className={INPUT} />
            </CheckoutField>
            <CheckoutField id={FIELD_ID.landmark} label="Landmark" optional error={e.landmark?.message} className="sm:col-span-2">
              <input id={FIELD_ID.landmark} {...register('landmark')} enterKeyHint="next" placeholder="Near the park / blue gate" aria-invalid={Boolean(e.landmark)} aria-describedby={describedBy(FIELD_ID.landmark, false, Boolean(e.landmark))} className={INPUT} />
            </CheckoutField>
            {belowMinimum && (
              <p role="status" className="rounded-2xl border-2 border-espresso bg-cheese/40 px-3 py-2 text-sm font-bold text-espresso sm:col-span-2">
                Delivery starts at {formatPKR(site.commerce.minDeliveryOrder)}. Add a little more, or pick takeaway / dine-in.
              </p>
            )}
          </motion.div>
        )}

        {type === 'takeaway' && (
          <motion.div key="takeaway" {...FADE_UP}>
            <CheckoutField id={FIELD_ID.pickupTime} label="Pickup time" hint={plan.isOpen ? 'ASAP is usually ready in about 15–25 min after we confirm.' : 'We are closed now, so these are from our next opening.'} error={e.pickupTime?.message}>
              <select id={FIELD_ID.pickupTime} {...register('pickupTime')} aria-invalid={Boolean(e.pickupTime)} aria-describedby={describedBy(FIELD_ID.pickupTime, true, Boolean(e.pickupTime))} className={INPUT}>
                {!plan.slots.some((s) => s.value === watch('pickupTime')) && <option value="">Pick a time…</option>}
                {plan.slots.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </CheckoutField>
          </motion.div>
        )}

        {type === 'dineIn' && (
          <motion.div key="dineIn" {...FADE_UP}>
            <CheckoutField id={FIELD_ID.table} label="Table number" hint="It's on the sticker on your table." error={e.table?.message}>
              <select id={FIELD_ID.table} {...register('table')} aria-invalid={Boolean(e.table)} aria-describedby={describedBy(FIELD_ID.table, true, Boolean(e.table))} className={INPUT}>
                <option value="">Pick your table…</option>
                {TABLES.map((t) => (
                  <option key={t} value={t}>
                    Table {t}
                  </option>
                ))}
              </select>
            </CheckoutField>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
