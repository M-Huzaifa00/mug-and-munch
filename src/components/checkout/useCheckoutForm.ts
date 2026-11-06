import { useEffect, useState } from 'react'
import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { checkoutSchema, EMPTY_CHECKOUT, type CheckoutForm, type CheckoutValues } from '@/lib/checkoutSchema'
import { useCart } from '@/store/cart'

const DRAFT_KEY = 'mm-checkout-draft'
export const CUSTOMER_KEY = 'mm-customer'

type SavedCustomer = Pick<CheckoutForm, 'name' | 'phone' | 'area' | 'address'>

const read = <T>(storage: () => Storage, key: string): Partial<T> => {
  try {
    const raw = storage().getItem(key)
    return raw ? (JSON.parse(raw) as Partial<T>) : {}
  } catch {
    return {}
  }
}

/** Only the fields we know, as strings (never trust storage blindly). */
function pickStrings(src: Partial<CheckoutForm>): Partial<CheckoutForm> {
  const out: Partial<Record<keyof CheckoutForm, unknown>> = {}
  for (const k of Object.keys(EMPTY_CHECKOUT) as (keyof CheckoutForm)[]) {
    if (typeof src[k] === typeof EMPTY_CHECKOUT[k]) out[k] = src[k]
  }
  return out as Partial<CheckoutForm>
}

/** Save / forget "Remember my details on this device" (off by default). */
export function rememberCustomer(values: CheckoutForm): void {
  try {
    if (values.remember) {
      const data: SavedCustomer = { name: values.name, phone: values.phone, area: values.area, address: values.address }
      localStorage.setItem(CUSTOMER_KEY, JSON.stringify(data))
    } else localStorage.removeItem(CUSTOMER_KEY)
  } catch {
    /* storage blocked: nothing to remember */
  }
}

export function clearCheckoutDraft(): void {
  try {
    sessionStorage.removeItem(DRAFT_KEY)
  } catch {
    /* ignore */
  }
}

/**
 * Checkout form: RHF + zod (discriminated union on orderType). Validates on blur, then on change.
 * Draft survives refresh (sessionStorage); remembered details prefill (localStorage mm-customer, opt-in).
 * orderType is mirrored into the cart store so the drawer and totals agree.
 */
export function useCheckoutForm() {
  const [defaults] = useState<CheckoutForm>(() => {
    const saved = pickStrings(read<SavedCustomer>(() => localStorage, CUSTOMER_KEY))
    const remembered = Object.keys(saved).length > 0
    const draft = pickStrings(read<CheckoutForm>(() => sessionStorage, DRAFT_KEY))
    return { ...EMPTY_CHECKOUT, orderType: useCart.getState().orderType, ...saved, remember: remembered, ...draft }
  })

  const form = useForm<CheckoutForm, unknown, CheckoutValues>({
    // The resolver validates the discriminated union; the form keeps a flat shape so switching types keeps input.
    resolver: zodResolver(checkoutSchema) as unknown as Resolver<CheckoutForm, unknown, CheckoutValues>,
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: defaults,
    // We focus the first invalid field ourselves (DOM order, after the error summary renders).
    shouldFocusError: false,
  })

  // Persist the draft + mirror orderType into the store.
  useEffect(() => {
    return form.subscribe({
      formState: { values: true },
      callback: ({ values, name }) => {
        try {
          sessionStorage.setItem(DRAFT_KEY, JSON.stringify(values))
        } catch {
          /* ignore */
        }
        if (name === 'orderType') useCart.getState().setOrderType(values.orderType)
      },
    })
  }, [form])

  return form
}
