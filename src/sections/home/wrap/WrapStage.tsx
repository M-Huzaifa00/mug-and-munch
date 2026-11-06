import { useId, type ReactNode } from 'react'
import { BRAND_INK } from '@/lib/brand'

/** Flat tortilla and rolled wrap: both closed paths so MorphSVG can tween between them. */
export const TORTILLA_FLAT = 'M24 160C24 92 376 92 376 160C376 228 24 228 24 160Z'
export const TORTILLA_ROLLED = 'M104 124C104 104 296 104 296 124L296 190C296 210 104 210 104 190Z'
const TORTILLA_FILL = 'color-mix(in oklab, var(--color-cheese) 45%, var(--color-oat))'
const hidden = { opacity: 0, visibility: 'hidden' } as const

/**
 * Tortilla scene for the wrap builder. `children` = the picked fillings.
 * Roll parts (seams, frills, paper band) start hidden; WrapItUp animates the data-* parts.
 */
export function WrapStage({ children }: { children: ReactNode }) {
  const check = `mm-wrapchk-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`

  return (
    <svg viewBox="0 0 400 270" className="h-full w-full overflow-visible" style={{ color: BRAND_INK }} aria-hidden="true">
      <defs>
        <pattern id={check} width="14" height="14" patternUnits="userSpaceOnUse">
          <rect width="14" height="14" className="fill-oat" />
          <path d="M0 0h7v7H0zM7 7h7v7H7z" fill="currentColor" />
        </pattern>
      </defs>
      <ellipse cx="200" cy="252" rx="170" ry="14" className="fill-espresso/15" />
      <g stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
        <path data-tortilla d={TORTILLA_FLAT} style={{ fill: TORTILLA_FILL }} />
        <g data-spots className="fill-caramel" stroke="none" opacity={0.7}>
          <ellipse cx="70" cy="150" rx="9" ry="5" /><ellipse cx="330" cy="172" rx="10" ry="5" /><ellipse cx="320" cy="126" rx="6" ry="4" /><ellipse cx="86" cy="192" rx="7" ry="4" />
        </g>
        <g data-fillings>{children}</g>
        <g data-seams fill="none" strokeWidth="4" style={hidden}>
          <path d="M150 112c-14 30-14 64 0 94" />
          <path d="M218 110c-14 32-14 66 0 98" />
        </g>
        <g data-frills style={hidden}>
          <path d="M104 132c-14-6-22 6-14 14-10 4-8 18 4 18-6 10 4 20 12 12z" className="fill-pickle" />
          <path d="M296 132c14-6 22 6 14 14 10 4 8 18-4 18 6 10-4 20-12 12z" className="fill-pickle" />
        </g>
        <path data-band d="M234 104h48v110h-48z" fill={`url(#${check})`} style={hidden} />
      </g>
    </svg>
  )
}
