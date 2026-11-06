import type { MunchForm } from '@/data/munchRun'
import { STROKE } from './shapes'

const line = { fill: 'none', stroke: 'currentColor', strokeWidth: STROKE, strokeLinecap: 'round', strokeLinejoin: 'round' } as const

/** Sesame seeds + lettuce + patty (cheese bun is the body fill). */
function Burger() {
  return (
    <>
      <path d="M16 66q7 6 14 0t14 0 14 0 14 0 14 0 14 0" className="fill-none stroke-pickle" strokeWidth={STROKE + 2} strokeLinecap="round" />
      <path d="M18 69Q60 75 102 69L102 79Q60 85 18 79Z" className="fill-chili" stroke="currentColor" strokeWidth={STROKE * 0.8} strokeLinejoin="round" />
      <g className="fill-oat" stroke="currentColor" strokeWidth="1.4">
        <ellipse cx="36" cy="33" rx="2.6" ry="1.6" transform="rotate(-25 36 33)" />
        <ellipse cx="60" cy="28" rx="2.6" ry="1.6" />
        <ellipse cx="84" cy="33" rx="2.6" ry="1.6" transform="rotate(25 84 33)" />
      </g>
    </>
  )
}

/** Fillings peeking out, fold line, checkered paper band with the round logo badge. */
function Wrap() {
  return (
    <>
      <path d="M42 22q5-12 13-5 6-10 13 0 8-6 11 6" className="fill-pickle" stroke="currentColor" strokeWidth={STROKE * 0.7} strokeLinejoin="round" />
      <circle cx="50" cy="19" r="3.6" className="fill-chili" stroke="currentColor" strokeWidth="1.6" />
      <path d="M40 30Q60 38 80 30" {...line} strokeWidth={STROKE * 0.6} />
      <g data-part="band">
        <path d="M33 66L87 66L88 84L32 84Z" className="fill-oat" stroke="currentColor" strokeWidth={STROKE * 0.8} strokeLinejoin="round" />
        <path d="M36 66v18M44 66v18M76 66v18M84 66v18" className="stroke-chili" strokeWidth="3" opacity="0.7" />
        <circle cx="60" cy="75" r="7" className="fill-chili" stroke="currentColor" strokeWidth="1.8" />
        <path d="M56 77l2-4 2 3 2-3 2 4" fill="none" className="stroke-oat" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </>
  )
}

/** Espresso top, caramel sleeve, steam (loops only once landed). */
function Coffee() {
  return (
    <>
      <ellipse cx="60" cy="30" rx="27" ry="3.4" className="fill-espresso" />
      <path data-part="sleeve" d="M35 64L85 64L83 84L37 84Z" className="fill-caramel" stroke="currentColor" strokeWidth={STROKE * 0.8} strokeLinejoin="round" />
      <path d="M46 74h28" {...line} strokeWidth="2" opacity="0.5" />
      <g data-part="steam" {...line} strokeWidth={STROKE * 0.7}>
        <path d="M48 18c-5-4 3-7-1-12" />
        <path d="M60 17c-5-4 3-7-1-13" />
        <path d="M72 18c-5-4 3-7-1-12" />
      </g>
    </>
  )
}

const DETAILS: Record<MunchForm, () => React.JSX.Element> = { burger: Burger, wrap: Wrap, coffee: Coffee }

/** Per-form detail group: scales + fades around the middle of a morph (details never morph). */
export function FormDetails({ form, visible }: { form: MunchForm; visible: boolean }) {
  const Inner = DETAILS[form]
  return (
    <g data-part="details" data-form={form} opacity={visible ? 1 : 0} style={{ transformOrigin: '60px 60px' }}>
      <Inner />
    </g>
  )
}
