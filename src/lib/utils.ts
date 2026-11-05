import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

/**
 * tailwind-merge must know our custom @theme tokens, otherwise it can't tell
 * `text-display` (font size) from `text-espresso` (colour) and drops one of them.
 * Keep in sync with src/styles/index.css.
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      color: ['espresso', 'oat', 'chili', 'cheese', 'caramel', 'pickle', 'bubblegum', 'ink'],
      text: ['mega', 'display'],
      font: ['display', 'sans', 'hand', 'urdu'],
      shadow: ['hard-sm', 'hard', 'hard-lg', 'hard-oat'],
      radius: ['blob'],
      ease: ['bouncy', 'snappy'],
      breakpoint: ['xs'],
    },
  },
})

/** Merge conditional class names, de-duplicating conflicting Tailwind utilities. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

const pkrFormatter = new Intl.NumberFormat('en-PK', { maximumFractionDigits: 0 })

/** formatPKR(1250) → "Rs 1,250" */
export function formatPKR(amount: number): string {
  return `Rs ${pkrFormatter.format(Math.round(amount))}`
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}
