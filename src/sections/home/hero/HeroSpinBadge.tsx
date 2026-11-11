import { useId } from 'react'
import { ArrowDown } from 'lucide-react'
import { useLenis } from 'lenis/react'
import { cn } from '@/lib/utils'

const RING = 'SIP · BITE · REPEAT · GOLDEN HOUR · '

/**
 * Spinning scroll badge (desktop): a cheese sticker with ring text slowly rotating (CSS; stopped by the global
 * reduced-motion rule) around a chili arrow. Click → smooth-scroll to the golden-hour cinema panel.
 */
export function HeroSpinBadge({ targetId, className }: { targetId: string; className?: string }) {
  const lenis = useLenis()
  const pathId = `ring-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`

  const go = () => {
    const el = document.getElementById(targetId)
    if (!el) return
    if (lenis) lenis.scrollTo(el, { offset: -90, duration: 1.4 })
    else el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <button
      type="button"
      onClick={go}
      aria-label="Scroll to the golden hour photo"
      className={cn('group sticker relative flex size-40 items-center justify-center rounded-full bg-cheese text-espresso xl:size-44', className)}
    >
      <svg viewBox="0 0 200 200" aria-hidden="true" className="absolute inset-0 size-full animate-[spin_16s_linear_infinite] group-hover:[animation-duration:6s]">
        <defs>
          <path id={pathId} d="M100 100m-74 0a74 74 0 1 1 148 0a74 74 0 1 1 -148 0" />
        </defs>
        <text className="fill-espresso font-display text-[17px] font-extrabold tracking-[0.18em]">
          {/* textLength = ring circumference (2π·74) so the text closes the loop exactly */}
          <textPath href={`#${pathId}`} textLength={465} lengthAdjust="spacing">
            {RING}
          </textPath>
        </text>
      </svg>
      <span className="flex size-16 items-center justify-center rounded-full border-[2.5px] border-espresso bg-chili text-espresso transition-[translate] duration-300 ease-bouncy group-hover:translate-y-1.5">
        <ArrowDown size={30} strokeWidth={2.8} aria-hidden="true" />
      </span>
    </button>
  )
}
