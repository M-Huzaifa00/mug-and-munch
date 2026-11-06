/** Shared checkout input look (16px+ text so iOS never zooms; visible focus ring from the base styles). */
export const INPUT =
  'min-h-12 w-full rounded-2xl border-[2.5px] border-espresso bg-oat px-4 text-base font-semibold text-espresso shadow-hard-sm placeholder:font-medium placeholder:text-ink/55 aria-[invalid=true]:border-chili aria-[invalid=true]:bg-chili/10'

/** Field name → DOM id (error summary links + focus-first-error). */
export const FIELD_ID = {
  area: 'co-area',
  address: 'co-address',
  landmark: 'co-landmark',
  pickupTime: 'co-pickup',
  table: 'co-table',
  name: 'co-name',
  phone: 'co-phone',
  notes: 'co-notes',
  payment: 'co-payment-cod',
} as const

export type FieldName = keyof typeof FIELD_ID

/** DOM order (used to focus the first invalid field). */
export const FIELD_ORDER: FieldName[] = ['area', 'address', 'landmark', 'pickupTime', 'table', 'name', 'phone', 'notes', 'payment']

/** aria-describedby for a field: hint + error ids that exist. */
export const describedBy = (id: string, hasHint: boolean, hasError: boolean) => [hasHint && `${id}-hint`, hasError && `${id}-error`].filter(Boolean).join(' ') || undefined
