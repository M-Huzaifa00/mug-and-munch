import { useId, type ReactNode } from 'react'
import type { SpiceLevel } from '@/data/menu'
import type { WrapBaseId } from '@/data/wrapBuilder'
import { BRAND_INK, brandSrc } from '@/lib/brand'

/** Flat tortilla and rolled wrap: both closed paths so MorphSVG can tween between them. */
export const TORTILLA_FLAT = 'M24 160C24 92 376 92 376 160C376 228 24 228 24 160Z'
export const TORTILLA_ROLLED = 'M104 124C104 104 296 104 296 124L296 190C296 210 104 210 104 190Z'
const BASE_FILL: Record<WrapBaseId, string> = {
  tortilla: 'color-mix(in oklab, var(--color-cheese) 45%, var(--color-oat))',
  wheat: 'color-mix(in oklab, var(--color-caramel) 45%, var(--color-oat))',
  paratha: 'color-mix(in oklab, var(--color-cheese) 70%, var(--color-caramel))',
}
const FLAKES: Record<SpiceLevel, number> = { mild: 0, medium: 5, 'desi-hot': 12 }
const hidden = { opacity: 0, visibility: 'hidden' } as const

/**
 * Board + tortilla scene for the wrap maker. `children` = the fillings.
 * Roll parts (seams, frills, paper band with the logo) start hidden; wrapAnimations.ts drives them.
 */
export function WrapStage({ base, spice, children }: { base: WrapBaseId; spice: SpiceLevel; children: ReactNode }) {
  const check = `mm-wrapchk-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`

  return (
    <svg viewBox="0 0 400 270" className="h-full w-full overflow-visible" style={{ color: BRAND_INK }} aria-hidden="true">
      <defs>
        <pattern id={check} width="14" height="14" patternUnits="userSpaceOnUse">
          <rect width="14" height="14" className="fill-oat" />
          <path d="M0 0h7v7H0zM7 7h7v7H7z" fill="currentColor" />
        </pattern>
      </defs>
      <rect x="6" y="216" width="388" height="40" rx="14" className="fill-caramel" stroke="currentColor" strokeWidth="5" />
      <g stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
        <path data-tortilla d={TORTILLA_FLAT} style={{ fill: BASE_FILL[base], transition: 'fill 400ms' }} />
        <g data-spots className="fill-caramel" stroke="none" opacity={0.7}>
          <ellipse cx="70" cy="150" rx="9" ry="5" /><ellipse cx="330" cy="172" rx="10" ry="5" /><ellipse cx="320" cy="126" rx="6" ry="4" /><ellipse cx="86" cy="192" rx="7" ry="4" />
          {base === 'paratha' && <path d="M60 170c20-20 60-24 80-6M260 130c30-10 60 0 70 20" fill="none" className="stroke-caramel" strokeWidth="3" />}
        </g>
        <g data-fillings>
          {children}
          <g className="fill-chili" stroke="none">
            {Array.from({ length: FLAKES[spice] }, (_, i) => (
              <circle key={i} cx={130 + ((i * 47) % 140)} cy={138 + ((i * 29) % 46)} r="2.4" />
            ))}
          </g>
        </g>
        <g data-seams fill="none" strokeWidth="4" style={hidden}>
          <path d="M150 112c-14 30-14 64 0 94" />
          <path d="M218 110c-14 32-14 66 0 98" />
        </g>
        <g data-frills style={hidden}>
          <path d="M104 132c-14-6-22 6-14 14-10 4-8 18 4 18-6 10 4 20 12 12z" className="fill-pickle" />
          <path d="M296 132c14-6 22 6 14 14 10 4 8 18-4 18 6 10-4 20-12 12z" className="fill-pickle" />
        </g>
        <g data-band style={hidden}>
          <path d="M226 104h64v110h-64z" fill={`url(#${check})`} />
          <circle cx="258" cy="159" r="22" className="fill-oat" />
          <image href={brandSrc('icon', 64)} x="242" y="139" width="32" height="40" />
        </g>
      </g>
    </svg>
  )
}
