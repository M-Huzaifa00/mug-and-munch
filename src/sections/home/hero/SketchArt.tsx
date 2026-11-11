import { useId } from 'react'
import { site } from '@/config/site'
import { SKETCH_ITEMS, type SketchPart } from '@/data/heroSketch'
import { BRAND_INK } from '@/lib/brand'

/**
 * "The Sketch": the logo's tray (iced coffee, smash burger, triangle wrap) as one big monoline drawing in the
 * logo's ink, with flat token-colour fills printed slightly off-register underneath (risograph look).
 * viewBox 600 × 520. Hooks for HeroNew's GSAP: [data-sk-line] (drawn), [data-sk-fill] (printed in),
 * [data-sk-item] (idle bob), [data-sk-steam], [data-sk-arrow], [data-sk-spark].
 */
const mix = (a: string, b: string, p: number) => `color-mix(in oklab, var(--color-${a}) ${p}%, var(--color-${b}))`
const OFF = 'translate(7 7)'
/** A tappable item group: redraws on hover, opens the item on click (wired in useSketchMotion). */
const part = (p: SketchPart) => ({ 'data-sk-item': '', 'data-sk-slug': SKETCH_ITEMS[p], 'data-cursor': 'view', 'data-cursor-label': 'See it', className: 'cursor-pointer' })

const lettuce = () => {
  let d = 'M240 360'
  for (let x = 240; x < 480; x += 24) d += ` Q${x + 12} 344 ${x + 24} 360`
  return `${d} L476 370 H244 Z`
}
const SEEDS: [number, number, number][] = [[312, 300, -24], [346, 284, -6], [382, 285, 14], [414, 302, 28], [330, 322, -14], [398, 322, 12], [364, 306, 0]]

export function SketchArt() {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const check = (
    <pattern id={`${id}c`} width="16" height="16" patternUnits="userSpaceOnUse">
      <rect width="16" height="16" style={{ fill: 'var(--color-oat)' }} />
      <rect width="8" height="8" style={{ fill: mix('chili', 'oat', 45) }} />
      <rect x="8" y="8" width="8" height="8" style={{ fill: mix('chili', 'oat', 45) }} />
    </pattern>
  )

  return (
    <svg data-sk-svg viewBox="0 0 600 520" className="block h-auto w-full overflow-visible" aria-hidden="true">
      <defs>{check}</defs>
      <g fill="none" stroke={BRAND_INK} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round">
        {/* tray + checkered liner */}
        <g data-sk-item>
          <g data-sk-fill transform={OFF} stroke="none">
            <path d="M40 432 L56 416 L72 432 L88 416 L104 432 L536 432 L552 416 L568 432 Z" fill={`url(#${id}c)`} />
            <rect x="30" y="432" width="540" height="36" rx="14" style={{ fill: 'var(--color-chili)' }} />
          </g>
          <path data-sk-line d="M40 432 L56 416 L72 432 L88 416 L104 432 M536 432 L552 416 L568 432" />
          <rect data-sk-line x="30" y="432" width="540" height="36" rx="14" />
          <text x="300" y="457" textAnchor="middle" stroke="none" style={{ fill: 'var(--color-oat)', font: '800 17px var(--font-display)', letterSpacing: '0.3em', textTransform: 'uppercase' }}>
            {site.brandName}
          </text>
        </g>

        {/* iced coffee */}
        <g {...part('cup')}>
          <g data-sk-fill transform={OFF} stroke="none">
            <path d="M80 152 H220 L204 430 H96 Z" style={{ fill: mix('oat', 'caramel', 70) }} />
            <path d="M86 202 Q116 190 150 202 T216 200 L204 430 H96 Z" style={{ fill: mix('caramel', 'oat', 78) }} />
            <path d="M156 118 L172 34 Q175 20 190 20 H216 V32 H192 Q186 32 185 38 L170 120 Z" style={{ fill: 'var(--color-chili)' }} />
            <path d="M70 152 H230 V140 Q230 128 218 128 H82 Q70 128 70 140 Z" style={{ fill: 'var(--color-oat)' }} />
            <circle cx="150" cy="300" r="34" style={{ fill: 'var(--color-cheese)' }} />
          </g>
          <path data-sk-line d="M156 118 L172 34 Q175 20 190 20 H216 V32 H192 Q186 32 185 38 L170 120" />
          <path data-sk-line d="M70 152 H230 V140 Q230 128 218 128 H82 Q70 128 70 140 Z M92 128 Q150 104 208 128" />
          <path data-sk-line d="M80 152 L96 430 H204 L220 152" />
          <path data-sk-line d="M86 202 Q116 190 150 202 T216 200" />
          <rect data-sk-line x="100" y="160" width="34" height="30" rx="7" transform="rotate(-8 117 175)" />
          <rect data-sk-line x="152" y="158" width="32" height="30" rx="7" transform="rotate(10 168 173)" />
          <circle data-sk-line cx="150" cy="300" r="34" />
          <path data-sk-line d="M150 280 C134 284 134 316 150 320 C166 316 166 284 150 280 Z M150 282 Q142 300 150 318" />
          <path data-sk-line d="M104 236 V330" style={{ stroke: 'var(--color-oat)' }} strokeWidth="7" />
        </g>

        {/* smash burger */}
        <g {...part('burger')}>
          <g data-sk-fill transform={OFF} stroke="none">
            <path d="M252 398 H468 Q470 432 440 432 H280 Q250 432 252 398 Z" style={{ fill: mix('caramel', 'cheese', 70) }} />
            <path d="M246 372 Q240 386 252 398 H468 Q480 386 474 372 Q470 364 460 366 H260 Q250 364 246 372 Z" style={{ fill: mix('espresso', 'caramel', 55) }} />
            <path d="M244 366 H476 L462 384 L452 374 L440 396 L428 374 H300 L288 390 L278 372 L262 386 Z" style={{ fill: 'var(--color-cheese)' }} />
            <path d={lettuce()} style={{ fill: 'var(--color-pickle)' }} />
            <path d="M244 350 C244 290 300 262 360 262 C420 262 476 290 476 350 Q476 358 468 358 H252 Q244 358 244 350 Z" style={{ fill: mix('caramel', 'cheese', 62) }} />
          </g>
          <path data-sk-line d="M252 398 H468 Q470 432 440 432 H280 Q250 432 252 398 Z" />
          <path data-sk-line d="M246 372 Q240 386 252 398 M468 398 Q480 386 474 372 Q470 364 460 366 M260 366 Q250 364 246 372" />
          <path data-sk-line d="M244 366 H476 L462 384 L452 374 L440 396 L428 374 H300 L288 390 L278 372 L262 386 Z" />
          <path data-sk-line d={lettuce()} />
          <path data-sk-line d="M244 350 C244 290 300 262 360 262 C420 262 476 290 476 350 Q476 358 468 358 H252 Q244 358 244 350 Z" />
          <path data-sk-line d="M282 306 Q298 282 330 274" style={{ stroke: 'var(--color-oat)' }} strokeWidth="7" />
          {SEEDS.map(([x, y, r]) => (
            <ellipse key={x} data-sk-line cx={x} cy={y} rx="6" ry="3" transform={`rotate(${r} ${x} ${y})`} strokeWidth="3.5" />
          ))}
        </g>

        {/* triangle wrap in a checkered sleeve */}
        <g {...part('wrap')}>
          <g data-sk-fill transform={OFF} stroke="none">
            <path d="M488 430 L566 430 L534 292 Z" style={{ fill: mix('cheese', 'oat', 45) }} />
            <path d="M515 316 Q522 300 534 292 L540 318 Q528 312 515 316 Z" style={{ fill: 'var(--color-pickle)' }} />
            <path d="M494 404 L506 370 H556 L564 404 L566 430 H488 Z" fill={`url(#${id}c)`} />
          </g>
          <path data-sk-line d="M488 430 L534 292 L566 430" />
          <path data-sk-line d="M515 316 Q524 304 534 292 M522 322 Q530 312 538 318" />
          <path data-sk-line d="M495 404 L506 370 H556 L564 404 M488 430 H566" />
          <circle data-sk-line cx="526" cy="344" r="2.5" />
          <circle data-sk-line cx="540" cy="352" r="2.5" />
        </g>

        {/* steam over the burger */}
        <g data-sk-steam style={{ stroke: mix('espresso', 'oat', 30) }} strokeWidth="3.5">
          <path d="M326 244 q-12 -16 0 -32 q12 -16 0 -32" />
          <path d="M362 238 q-12 -16 0 -32 q12 -16 0 -32" />
          <path d="M398 244 q-12 -16 0 -32 q12 -16 0 -32" />
        </g>

        {/* note arrows (hand-drawn) */}
        <path data-sk-arrow d="M58 84 Q60 112 84 122 M74 112 L84 122 L70 126" strokeWidth="3" />
        <path data-sk-arrow d="M478 104 Q470 190 426 244 M436 230 L426 244 L422 228" strokeWidth="3" />
        <path data-sk-arrow d="M560 492 Q572 470 556 446 M552 462 L556 446 L568 456" strokeWidth="3" />

        {/* sparkles */}
        <path data-sk-spark d="M40 196 l4 -12 l4 12 l12 4 l-12 4 l-4 12 l-4 -12 l-12 -4 z" style={{ fill: 'var(--color-cheese)' }} strokeWidth="2.5" />
        <path data-sk-spark d="M578 236 l3 -9 l3 9 l9 3 l-9 3 l-3 9 l-3 -9 l-9 -3 z" style={{ fill: 'var(--color-bubblegum)' }} strokeWidth="2.5" />
      </g>
    </svg>
  )
}
