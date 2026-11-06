import type { FieldErrors } from 'react-hook-form'
import type { CheckoutForm } from '@/lib/checkoutSchema'
import { FIELD_ID, FIELD_ORDER } from './fieldStyles'

/** Shown after a failed send: every error, linking to its field. */
export function ErrorSummary({ errors, extra = [] }: { errors: FieldErrors<CheckoutForm>; extra?: string[] }) {
  const list = FIELD_ORDER.flatMap((name) => {
    const msg = errors[name]?.message
    return msg ? [{ name, msg }] : []
  })
  if (list.length === 0 && extra.length === 0) return null

  return (
    <div id="co-errors" tabIndex={-1} role="alert" aria-labelledby="co-errors-title" className="rounded-3xl border-[2.5px] border-espresso bg-chili/15 p-4">
      <h2 id="co-errors-title" className="font-display text-lg font-extrabold text-espresso">
        Thoda sa fix karna hai 👇
      </h2>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm font-semibold text-espresso">
        {extra.map((m) => (
          <li key={m}>{m}</li>
        ))}
        {list.map(({ name, msg }) => (
          <li key={name}>
            <a
              href={`#${FIELD_ID[name]}`}
              onClick={(e) => {
                e.preventDefault()
                document.getElementById(FIELD_ID[name])?.focus()
              }}
              className="underline decoration-2 underline-offset-2"
            >
              {msg}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
