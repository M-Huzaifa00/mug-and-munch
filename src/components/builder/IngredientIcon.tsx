import type { ReactNode } from 'react'
import type { IconShape, IconSpec, IconTone } from '@/data/builder'
import { BRAND_INK } from '@/lib/brand'
import { cn } from '@/lib/utils'

const FILL: Record<IconTone, string> = {
  chili: 'fill-chili',
  cheese: 'fill-cheese',
  caramel: 'fill-caramel',
  pickle: 'fill-pickle',
  bubblegum: 'fill-bubblegum',
  oat: 'fill-oat',
  espresso: 'fill-espresso',
}
const STROKE: Record<IconTone, string> = {
  chili: 'stroke-chili',
  cheese: 'stroke-cheese',
  caramel: 'stroke-caramel',
  pickle: 'stroke-pickle',
  bubblegum: 'stroke-bubblegum',
  oat: 'stroke-oat',
  espresso: 'stroke-espresso',
}

/** 32×32 glyphs in the burger-illustration style (brand-ink lines, rounded, token fills). */
const SHAPES: Record<IconShape, (fill: string, stroke: string, n: number) => ReactNode> = {
  patty: () => (
    <>
      <rect x="3" y="11" width="26" height="11" rx="5" className="fill-espresso" />
      <circle cx="10" cy="15" r="1.3" className="fill-caramel" stroke="none" />
      <circle cx="18" cy="18" r="1.3" className="fill-caramel" stroke="none" />
    </>
  ),
  slice: (f) => <path d="M4 10h24l-3 6c-1 2-3 2-4 0l-2-3-4 7c-1 2-3 2-4 0l-2-4-2 3c-1 2-3 2-4 0z" className={f} />,
  rings: (_f, s) => (
    <g fill="none" className={s} strokeWidth="3.5">
      <ellipse cx="11" cy="16" rx="7" ry="5" />
      <ellipse cx="21" cy="16" rx="7" ry="5" />
    </g>
  ),
  drop: (f) => <path d="M16 4c5 7 9 11 9 16a9 9 0 0 1-18 0c0-5 4-9 9-16z" className={f} />,
  leaf: (f) => <path d="M4 22c4-14 14-18 24-16-2 12-10 20-24 16zM8 20l14-10" className={f} />,
  bun: () => (
    <>
      <path d="M4 22c0-9 5-15 12-15s12 6 12 15z" className="fill-cheese" />
      <ellipse cx="12" cy="13" rx="1.6" ry="1" className="fill-oat" />
      <ellipse cx="19" cy="12" rx="1.6" ry="1" className="fill-oat" />
    </>
  ),
  flat: (f) => (
    <>
      <ellipse cx="16" cy="17" rx="13" ry="8" className={f} />
      <ellipse cx="11" cy="15" rx="2" ry="1" className="fill-caramel" stroke="none" />
      <ellipse cx="20" cy="19" rx="2" ry="1" className="fill-caramel" stroke="none" />
    </>
  ),
  chunks: (f) => (
    <g className={f}>
      <rect x="3" y="12" width="9" height="8" rx="3" />
      <rect x="12" y="15" width="9" height="8" rx="3" />
      <rect x="20" y="10" width="9" height="8" rx="3" />
    </g>
  ),
  cup: (f, _s, n) => {
    const h = 10 + n * 3
    return (
      <>
        <path d={`M8 ${28 - h}h16l-2 ${h - 2}c0 1-1 2-2 2h-8c-1 0-2-1-2-2z`} className="fill-oat" />
        <path d={`M8.5 ${28 - h + 4}h15l-1.4 ${h - 6}c0 1-1 1.5-2 1.5h-8c-1 0-2-.5-2-1.5z`} className={f} stroke="none" />
        <path d={`M24 ${30 - h}c4 0 4 6 0 6`} fill="none" />
      </>
    )
  },
  carton: (f) => (
    <>
      <path d="M10 10l3-5h6l3 5v17H10z" className={f} />
      <path d="M10 10h12" />
    </>
  ),
  flame: (f) => <path d="M16 3c2 6 9 8 9 16a9 9 0 0 1-18 0c0-4 2-6 4-8 0 3 1 5 3 5-1-5 0-9 2-13z" className={f} />,
  ice: () => (
    <>
      <rect x="5" y="8" width="13" height="13" rx="3" className="fill-oat" />
      <rect x="14" y="14" width="13" height="13" rx="3" className="fill-oat" />
    </>
  ),
  shot: () => (
    <>
      <path d="M9 6h14l-2 20H11z" className="fill-oat" />
      <path d="M10 12h12l-1.4 13h-9.2z" className="fill-espresso" stroke="none" />
    </>
  ),
  swirl: () => <path d="M6 24h20c0-4-3-6-6-6 1-4-2-7-5-6 0-3-3-5-5-3 2 2 0 4-2 4-3 1-3 6-2 11z" className="fill-oat" />,
  chili: (f, _s, n) => (
    <g className={f}>
      {Array.from({ length: n }, (_, i) => (
        <path key={i} d={`M${6 + i * 8} 8c4 2 4 14 0 18-3-4-3-14 0-18z`} transform={`rotate(${(i - (n - 1) / 2) * 12} ${6 + i * 8} 17)`} />
      ))}
    </g>
  ),
  tomato: (f) => (
    <>
      <circle cx="16" cy="16" r="11" className={f} />
      <path d="M16 8v16M8 16h16" className="stroke-cheese" strokeWidth="2" />
    </>
  ),
  cucumber: (f) => (
    <>
      <circle cx="16" cy="16" r="11" className={f} />
      <circle cx="16" cy="16" r="6" className="fill-oat" />
    </>
  ),
  dots: (f) => (
    <g className={f}>
      <circle cx="9" cy="12" r="3" /><circle cx="20" cy="10" r="3" /><circle cx="14" cy="21" r="3" /><circle cx="24" cy="20" r="3" />
    </g>
  ),
}

/** Small inline SVG icon for a builder tile. */
export function IngredientIcon({ icon, className }: { icon: IconSpec; className?: string }) {
  const tone = icon.tone ?? 'oat'
  return (
    <svg viewBox="0 0 32 32" className={cn('size-8 shrink-0', className)} style={{ color: BRAND_INK }} aria-hidden="true">
      <g stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        {SHAPES[icon.shape](FILL[tone], STROKE[tone], icon.n ?? 1)}
      </g>
    </svg>
  )
}
