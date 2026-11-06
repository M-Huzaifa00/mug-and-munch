import { useId, useRef } from 'react'
import { site } from '@/config/site'
import { BRAND_INK } from '@/lib/brand'
import { gsap, MQ, useGSAP } from '@/lib/gsap'
import { cn } from '@/lib/utils'
import { BrandImage } from './BrandImage'

const RING_TEXT = `${site.brandName.toUpperCase()} · ${site.address.city.toUpperCase()} · ${site.tagline.toUpperCase()} · `
const RADIUS = 74

/** Circular sticker: logo icon in the middle, brand text rotating around it on a circular path. */
export function LogoStamp({ size = 140, spin = true, className }: { size?: number; spin?: boolean; className?: string }) {
  const pathId = useId()
  const ringRef = useRef<SVGSVGElement>(null)

  useGSAP(
    () => {
      if (!spin || !ringRef.current) return
      const mm = gsap.matchMedia()
      mm.add(MQ.motionOk, () => {
        gsap.to(ringRef.current, { rotation: 360, transformOrigin: '50% 50%', duration: 22, ease: 'none', repeat: -1 })
      })
    },
    { dependencies: [spin] },
  )

  return (
    <span
      role="img"
      aria-label={`${site.brandName} · ${site.address.city} · ${site.tagline}`}
      className={cn('relative inline-flex shrink-0 items-center justify-center', className)}
      style={{ width: size, height: size, color: BRAND_INK }}
    >
      <svg viewBox="0 0 200 200" className="absolute inset-0 size-full drop-shadow-[3px_4px_0_var(--color-espresso)]" aria-hidden="true">
        <circle cx="100" cy="100" r="96" className="fill-oat" stroke="currentColor" strokeWidth="4" />
      </svg>
      <svg ref={ringRef} viewBox="0 0 200 200" className="absolute inset-0 size-full" aria-hidden="true">
        <defs>
          <path id={pathId} d={`M100,100 m-${RADIUS},0 a${RADIUS},${RADIUS} 0 1,1 ${RADIUS * 2},0 a${RADIUS},${RADIUS} 0 1,1 -${RADIUS * 2},0`} />
        </defs>
        <circle cx="100" cy="100" r="58" fill="none" stroke="currentColor" strokeWidth="2.5" strokeDasharray="2 6" strokeLinecap="round" />
        <text className="font-display" fontSize="15.5" fontWeight="800" letterSpacing="1.5" fill="currentColor">
          <textPath href={`#${pathId}`} textLength={Math.round(2 * Math.PI * RADIUS) - 4} lengthAdjust="spacing">
            {RING_TEXT}
          </textPath>
        </text>
      </svg>
      <BrandImage kind="icon" height={Math.round(size * 0.48)} alt="" className="relative" />
    </span>
  )
}
