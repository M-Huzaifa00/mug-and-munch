import { useFormContext } from 'react-hook-form'
import { NOTES_MAX, type CheckoutForm } from '@/lib/checkoutSchema'
import { formatPkMobileInput } from '@/lib/phone'
import { cn } from '@/lib/utils'
import { CheckoutField } from './CheckoutField'
import { describedBy, FIELD_ID, INPUT } from './fieldStyles'

/** Name, phone (live 03XX-XXXXXXX), notes (200 max + counter), "Remember my details" (off by default). */
export function DetailsFields() {
  const { register, watch, formState } = useFormContext<CheckoutForm>()
  const e = formState.errors
  const notes = watch('notes') ?? ''
  const phone = register('phone')

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <CheckoutField id={FIELD_ID.name} label="Your name" error={e.name?.message}>
        <input id={FIELD_ID.name} {...register('name')} autoComplete="name" enterKeyHint="next" aria-invalid={Boolean(e.name)} aria-describedby={describedBy(FIELD_ID.name, false, Boolean(e.name))} className={INPUT} />
      </CheckoutField>

      <CheckoutField id={FIELD_ID.phone} label="WhatsApp / mobile number" hint="We confirm your order on this number." error={e.phone?.message}>
        <input
          id={FIELD_ID.phone}
          {...phone}
          onChange={(ev) => {
            ev.target.value = formatPkMobileInput(ev.target.value)
            void phone.onChange(ev)
          }}
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          enterKeyHint="next"
          placeholder="0300-1234567"
          maxLength={16}
          aria-invalid={Boolean(e.phone)}
          aria-describedby={describedBy(FIELD_ID.phone, true, Boolean(e.phone))}
          className={INPUT}
        />
      </CheckoutField>

      <CheckoutField
        id={FIELD_ID.notes}
        label="Notes for the kitchen / rider"
        optional
        className="sm:col-span-2"
        hint={
          <span aria-live="polite" className={cn(notes.length > NOTES_MAX - 20 && 'font-extrabold text-espresso')}>
            {notes.length}/{NOTES_MAX}
          </span>
        }
        error={e.notes?.message}
      >
        <textarea
          id={FIELD_ID.notes}
          {...register('notes')}
          rows={3}
          maxLength={NOTES_MAX}
          enterKeyHint="done"
          placeholder="No onions please, ring the bell twice…"
          aria-invalid={Boolean(e.notes)}
          aria-describedby={describedBy(FIELD_ID.notes, true, Boolean(e.notes))}
          className={cn(INPUT, 'min-h-24 py-3')}
        />
      </CheckoutField>

      <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm font-bold text-espresso sm:col-span-2">
        <input type="checkbox" {...register('remember')} className="size-6 shrink-0 cursor-pointer rounded-md border-2 border-espresso accent-chili" />
        Remember my details on this device
      </label>
    </div>
  )
}
