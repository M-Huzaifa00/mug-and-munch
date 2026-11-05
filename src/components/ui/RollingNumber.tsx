import { cn } from '@/lib/utils'

interface RollingNumberProps {
  value: number
  /** Formatter, e.g. formatPKR. Non-digit characters render static. */
  format?: (n: number) => string
  className?: string
}

const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

/**
 * Odometer-style number: each digit is a vertical 0–9 strip translated with a CSS transform
 * (transform-only, reduced-motion CSS makes it instant). Screen readers get the plain text.
 */
export function RollingNumber({ value, format = String, className }: RollingNumberProps) {
  const text = format(value)
  const chars = text.split('')

  return (
    <span className={cn('relative inline-flex tabular-nums', className)}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="inline-flex overflow-hidden leading-none">
        {chars.map((ch, i) => {
          // Key from the right so units stay the same element when the length changes.
          const key = chars.length - i
          if (!/\d/.test(ch)) {
            return (
              <span key={`c${key}`} className="inline-block h-[1em] leading-none whitespace-pre">
                {ch}
              </span>
            )
          }
          return (
            <span key={`d${key}`} className="relative inline-block h-[1em] overflow-hidden">
              <span
                className="flex flex-col transition-transform duration-500 ease-bouncy"
                style={{ transform: `translateY(-${Number(ch) * 10}%)` }}
              >
                {DIGITS.map((d) => (
                  <span key={d} className="block h-[1em] leading-none">
                    {d}
                  </span>
                ))}
              </span>
            </span>
          )
        })}
      </span>
    </span>
  )
}
