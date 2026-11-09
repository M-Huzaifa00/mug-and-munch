import type { ReactNode } from 'react'
import type { LayerKind } from './burgerLayerKind'

/**
 * Realistic burger layer art (viewBox width 240). Shades are mixes of the LOCKED tokens (no new colours):
 * toasted bun, seared patty with crispy edges, melting cheese, ruffled lettuce, red onion, jalapeños, sauce.
 */
type Token = 'espresso' | 'oat' | 'chili' | 'cheese' | 'caramel' | 'pickle' | 'bubblegum' | 'ink'
const mix = (a: Token, b: Token, pct: number) => `color-mix(in oklab, var(--color-${a}) ${pct}%, var(--color-${b}))`
const v = (t: Token) => `var(--color-${t})`

const OUTLINE = { stroke: v('espresso'), strokeOpacity: 0.55, strokeWidth: 1.6, strokeLinejoin: 'round', strokeLinecap: 'round' } as const

/** Vertical gradient from [offset, colour] stops (plain helper, not a component). */
const grad = (id: string, stops: [number, string][]) => (
  <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
    {stops.map(([o, c]) => (
      <stop key={o} offset={o} style={{ stopColor: c }} />
    ))}
  </linearGradient>
)

const BUN_STOPS: [number, string][] = [
  [0, mix('cheese', 'oat', 55)],
  [0.35, mix('caramel', 'cheese', 45)],
  [0.8, mix('caramel', 'espresso', 85)],
  [1, mix('caramel', 'espresso', 62)],
]

const SEEDS: [number, number, number][] = [
  [72, 34, -25], [96, 22, -10], [122, 16, 5], [148, 24, 18], [170, 38, 30], [86, 50, -15], [112, 40, 0],
  [138, 46, 12], [160, 58, 25], [62, 58, -30], [100, 64, 8], [128, 66, -6], [182, 62, 20], [52, 72, -12],
]

export const BURGER_ART: Record<LayerKind, (id: string) => ReactNode> = {
  bun: (id) => (
    <>
      <defs>
        {grad(`${id}g`, BUN_STOPS)}
        <radialGradient id={`${id}h`} cx="0.36" cy="0.25" r="0.45">
          <stop offset="0" style={{ stopColor: v('oat'), stopOpacity: 0.75 }} />
          <stop offset="1" style={{ stopColor: v('oat'), stopOpacity: 0 }} />
        </radialGradient>
      </defs>
      <path d="M12 80C12 38 60 4 120 4s108 34 108 76c0 4-3 7-7 7H19c-4 0-7-3-7-7z" fill={`url(#${id}g)`} {...OUTLINE} />
      <path d="M14 80C14 40 60 8 120 8s104 32 104 72" fill={`url(#${id}h)`} stroke="none" />
      {/* toasted cut edge */}
      <path d="M16 80h208c0 4-3 7-7 7H23c-4 0-7-3-7-7z" style={{ fill: mix('oat', 'cheese', 65) }} stroke="none" />
      {SEEDS.map(([x, y, r]) => (
        <g key={`${x}-${y}`} transform={`rotate(${r} ${x} ${y})`}>
          <ellipse cx={x + 0.8} cy={y + 1.2} rx="4.2" ry="2.1" style={{ fill: v('espresso') }} opacity="0.22" />
          <ellipse cx={x} cy={y} rx="4" ry="2" style={{ fill: mix('oat', 'cheese', 85) }} />
          <ellipse cx={x - 1} cy={y - 0.6} rx="1.6" ry="0.7" style={{ fill: v('oat') }} />
        </g>
      ))}
    </>
  ),
  bottom: (id) => (
    <>
      <defs>
        {grad(`${id}g`, [[0, mix('caramel', 'cheese', 50)], [0.6, mix('caramel', 'espresso', 82)], [1, mix('caramel', 'espresso', 60)]])}
      </defs>
      <path d="M16 8h208c4 0 6 3 5 7-4 20-22 31-50 31H61C33 46 15 35 11 15c-1-4 1-7 5-7z" fill={`url(#${id}g)`} {...OUTLINE} />
      {/* soft crumb on the cut face */}
      <path d="M16 6h208c3 0 5 2 5 4H11c0-2 2-4 5-4z" style={{ fill: mix('oat', 'cheese', 60) }} stroke="none" />
      <path d="M40 30c30 8 130 8 160 0" fill="none" style={{ stroke: v('oat') }} strokeOpacity="0.25" strokeWidth="3" strokeLinecap="round" />
    </>
  ),
  patty: (id) => (
    <>
      <defs>
        {grad(`${id}g`, [[0, mix('caramel', 'espresso', 72)], [0.45, mix('caramel', 'espresso', 45)], [1, mix('espresso', 'caramel', 85)]])}
      </defs>
      {/* lacy, crispy smashed edge */}
      <path
        d="M10 14c-3-5 2-10 8-9 4-4 10-3 14-1 6-3 12-2 18 0 8-2 16-2 24 0 10-2 20-2 30 0 10-2 22-2 32 0 9-2 18-2 26 0 6-2 12-2 17 1 6-2 12 0 14 5 5 2 6 7 3 11 3 5 1 11-5 12-2 6-8 9-14 8H26c-8 1-14-3-16-9-5-3-6-9-2-13-2-2 0-4 2-5z"
        fill={`url(#${id}g)`}
        {...OUTLINE}
      />
      {/* sear marks + juicy sheen */}
      <g style={{ fill: mix('caramel', 'espresso', 70) }} opacity="0.9">
        {[30, 58, 84, 112, 138, 166, 194].map((x, i) => (
          <ellipse key={x} cx={x} cy={14 + (i % 3) * 5} rx={4 + (i % 2)} ry="1.8" transform={`rotate(${(i % 2 ? 1 : -1) * 12} ${x} ${14 + (i % 3) * 5})`} />
        ))}
      </g>
      <g style={{ fill: v('espresso') }} opacity="0.55">
        {[44, 72, 100, 126, 152, 180, 204].map((x, i) => (
          <circle key={x} cx={x} cy={20 + (i % 2) * 6} r="1.6" />
        ))}
      </g>
      <path d="M44 12c36-3 110-3 150 0" fill="none" style={{ stroke: mix('oat', 'caramel', 40) }} strokeOpacity="0.45" strokeWidth="2.5" strokeLinecap="round" />
    </>
  ),
  cheese: (id) => (
    <>
      <defs>
        {grad(`${id}g`, [[0, mix('cheese', 'oat', 80)], [0.5, v('cheese')], [1, mix('cheese', 'chili', 78)]])}
      </defs>
      {/* melting slice with drips over the edge */}
      <path
        d="M6 4h228c3 0 4 3 2 5l-10 6c-3 2-4 6-4 10 0 4-6 5-7 0l-1-6c-1-3-5-3-7 0l-9 9c-3 3-8 1-8-3v-4c0-3-4-4-6-2l-6 5H70l-5 3c-2 1-5 0-5-3l-1-2c-1-3-5-3-7-1l-8 10c-3 4-9 2-9-3v-4c0-3-3-5-6-3l-9 6c-3 2-7-1-5-4l2-5c1-3-2-5-5-4L8 12C5 13 3 10 4 8z"
        fill={`url(#${id}g)`}
        {...OUTLINE}
      />
      <path d="M26 8c30-1 70-1 104 0M150 9c20 0 40 0 58-1" fill="none" style={{ stroke: v('oat') }} strokeOpacity="0.7" strokeWidth="2.4" strokeLinecap="round" />
      <ellipse cx="44" cy="20" rx="2" ry="3" style={{ fill: v('oat') }} opacity="0.6" />
    </>
  ),
  jalapeno: () => (
    <>
      {[34, 82, 130, 178, 214].map((x, i) => (
        <g key={x} transform={`rotate(${(i % 2 ? 1 : -1) * 8} ${x} 13)`}>
          <ellipse cx={x} cy="14" rx="20" ry="9.5" style={{ fill: mix('pickle', 'espresso', 52) }} {...OUTLINE} />
          <ellipse cx={x} cy="13" rx="15" ry="6.5" style={{ fill: mix('pickle', 'oat', 62) }} />
          <ellipse cx={x} cy="13" rx="7" ry="3" style={{ fill: mix('oat', 'pickle', 80) }} />
          {[-4, 0, 4].map((dx) => (
            <ellipse key={dx} cx={x + dx} cy={13 + (dx === 0 ? -1 : 0.8)} rx="1.4" ry="0.9" style={{ fill: v('oat') }} />
          ))}
          <path d={`M${x - 13} 10c6-3 18-3 24 0`} fill="none" style={{ stroke: v('oat') }} strokeOpacity="0.5" strokeWidth="1.4" />
        </g>
      ))}
    </>
  ),
  sauce: (id) => (
    <>
      <defs>
        {grad(`${id}g`, [[0, mix('cheese', 'chili', 55)], [1, mix('chili', 'cheese', 70)]])}
      </defs>
      <path
        d="M8 5c40-3 184-3 224 0 3 1 3 5 0 6-5 2-7 4-7 8 0 3-5 3-6 0-1-4-5-5-8-2-3 2-7 1-8-2-1-2-5-2-6 0-2 5-8 5-9 0l-1-2c-1-2-4-2-6 0-4 3-10 2-12-2H70c-3 3-7 3-9 0-2-2-5-2-6 0-2 6-9 6-10 0-1-2-4-3-6-1-3 3-8 2-9-2-1-2-4-2-5 0-1 3-6 3-6 0 0-4-3-6-7-7-3-1-3-5-2-6z"
        fill={`url(#${id}g)`}
        {...OUTLINE}
      />
      <path d="M30 7c40-1 120-1 170 0" fill="none" style={{ stroke: v('oat') }} strokeOpacity="0.55" strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  lettuce: (id) => (
    <>
      <defs>
        {grad(`${id}g`, [[0, mix('pickle', 'oat', 70)], [0.55, v('pickle')], [1, mix('pickle', 'espresso', 62)]])}
      </defs>
      {/* ruffled leaf edge */}
      <path
        d="M4 14c4-6 10-6 13-2 3-7 11-8 15-2 4-6 12-6 15 0 4-7 12-7 16-1 4-6 12-6 15 0 4-7 12-7 16-1 4-6 12-6 15 0 4-7 12-7 16-1 4-6 12-6 15 0 4-7 12-7 16-1 4-6 12-6 15 0 4-6 11-6 14 0 4-5 10-3 11 3 3 5-1 11-8 12H14C6 26 1 20 4 14z"
        fill={`url(#${id}g)`}
        {...OUTLINE}
      />
      <g fill="none" style={{ stroke: mix('oat', 'pickle', 55) }} strokeOpacity="0.8" strokeWidth="1.3" strokeLinecap="round">
        {[34, 74, 114, 154, 194].map((x) => (
          <path key={x} d={`M${x} 23c1-3 1-5 0-7M${x} 20c-3-1-5-2-6-4M${x} 20c3-1 5-2 6-4`} />
        ))}
      </g>
    </>
  ),
  onion: () => (
    <>
      {[50, 112, 174].map((x, i) => (
        <g key={x}>
          <ellipse cx={x} cy="13" rx="36" ry="8.5" fill="none" style={{ stroke: mix('bubblegum', 'espresso', 62) }} strokeWidth="6" />
          <ellipse cx={x} cy="13" rx="36" ry="8.5" fill="none" style={{ stroke: mix('oat', 'bubblegum', 70) }} strokeWidth="2.2" />
          <ellipse cx={x + (i % 2 ? 4 : -4)} cy="13" rx="24" ry="5.5" fill="none" style={{ stroke: mix('bubblegum', 'espresso', 70) }} strokeWidth="4" opacity="0.9" />
          <ellipse cx={x + (i % 2 ? 4 : -4)} cy="13" rx="24" ry="5.5" fill="none" style={{ stroke: v('oat') }} strokeWidth="1.4" opacity="0.7" />
        </g>
      ))}
    </>
  ),
}
