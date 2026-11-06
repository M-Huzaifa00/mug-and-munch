import { useId } from 'react'
import type { MunchForm } from '@/data/munchRun'
import { BRAND_INK } from '@/lib/brand'
import { FormDetails } from './forms/FormDetails'
import { MunchFace } from './forms/MunchFace'
import { BODY, FACE_Y, FORMS, STROKE } from './forms/shapes'

const FILL_CLASS: Record<MunchForm, string> = { burger: 'fill-cheese', wrap: 'fill-oat', coffee: 'fill-oat' }

/**
 * The traveler art. ONE body path (morphed), reused three times via <use>: hard espresso offset shadow,
 * thick oat sticker cut-line, then the brand-ink outlined fill, so it reads on oat, cheese and espresso.
 * All three detail groups are present; only the current form's is visible.
 */
export function MunchCharacter({ form, className }: { form: MunchForm; className?: string }) {
  const id = `mr-body-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
  const href = `#${id}`

  return (
    <svg viewBox="0 0 120 120" className={className} style={{ color: BRAND_INK, overflow: 'visible' }} aria-hidden="true" focusable="false">
      <defs>
        <path id={id} data-part="body" d={BODY[form]} />
      </defs>
      <ellipse data-part="shadow" cx="60" cy="113" rx="30" ry="4.5" className="fill-espresso" opacity="0" />
      <g data-part="figure">
        <use href={href} className="fill-espresso" transform="translate(3 3.5)" />
        <use href={href} className="fill-oat stroke-oat" strokeWidth={STROKE + 6} strokeLinejoin="round" />
        <use href={href} data-part="fill" className={FILL_CLASS[form]} stroke="currentColor" strokeWidth={STROKE} strokeLinejoin="round" />
        {FORMS.map((f) => (
          <FormDetails key={f} form={f} visible={f === form} />
        ))}
        <MunchFace y={FACE_Y[form]} />
      </g>
    </svg>
  )
}
