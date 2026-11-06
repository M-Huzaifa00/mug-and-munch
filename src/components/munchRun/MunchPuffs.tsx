import { BRAND_INK } from '@/lib/brand'

const STAR = 'M6 0l1.6 4.4L12 6l-4.4 1.6L6 12 4.4 7.6 0 6l4.4-1.6z'

/** Pooled effect sprites: crumbs (sesame / herb), a dust puff and a sparkle puff. Positioned by GSAP. */
export function MunchPuffs() {
  return (
    <>
      {Array.from({ length: 8 }, (_, i) => (
        <svg key={i} data-mr="crumb" viewBox="0 0 10 10" className="group absolute top-0 left-0 size-2.5 opacity-0" style={{ color: BRAND_INK }}>
          <ellipse cx="5" cy="5" rx="4" ry="2.4" className="fill-oat group-data-[kind=herb]:fill-pickle" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      ))}
      <div data-mr="dust" className="invisible absolute top-0 left-0">
        {Array.from({ length: 5 }, (_, i) => (
          <span key={i} className="absolute -top-2 -left-2 size-4 rounded-full border-2 border-espresso/40 bg-oat" />
        ))}
      </div>
      <div data-mr="sparkle" className="invisible absolute top-0 left-0">
        {['fill-cheese', 'fill-bubblegum', 'fill-cheese', 'fill-bubblegum'].map((c, i) => (
          <svg key={i} viewBox="0 0 12 12" className={`absolute -top-3 -left-3 ${i === 3 ? 'size-7' : 'size-5'}`} style={{ color: BRAND_INK }}>
            <path d={STAR} className={c} stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
          </svg>
        ))}
      </div>
    </>
  )
}
