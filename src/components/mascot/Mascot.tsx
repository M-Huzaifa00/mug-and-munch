import { useId, useRef } from 'react'
import { BRAND_INK } from '@/lib/brand'
import { cn } from '@/lib/utils'
import { MascotFace } from './MascotFace'
import { ARM_PIVOT, ARM_ROTATION, MASCOT_POSES, type MascotMood } from './mascotPoses'
import { useMascotAnimation } from './useMascotAnimation'
import { useMascotReactions } from './useMascotReactions'

interface MascotProps {
  mood?: MascotMood
  /** React to cart events (wave on first add, excited on every add, sleep after 30s idle). */
  reactive?: boolean
  /** peek mood: called after Munchy has slid in and looked around (otherwise it hides again). */
  onPeekEnd?: () => void
  className?: string
  /** Accessible label; omit to make it decorative. */
  label?: string
}

const arm = (side: 'armL' | 'armR', rotation: number, d: string, hand: [number, number]) => {
  const [px, py] = ARM_PIVOT[side]
  return (
    <g data-part={side} transform={`rotate(${rotation} ${px} ${py})`}>
      <path d={d} />
      <circle cx={hand[0]} cy={hand[1]} r="7" className="fill-oat" />
    </g>
  )
}

/**
 * Munchy, the Mug n Munch kid: curly hair, cap, wink + tongue grin, balancing the café tray.
 * Hand-built from the logo. Each mood = static pose (reduced motion) + GSAP timeline.
 */
export function Mascot({ mood = 'idle', reactive = false, onPeekEnd, className, label }: MascotProps) {
  const activeMood = useMascotReactions(mood, reactive)
  const pose = MASCOT_POSES[activeMood]
  const svgRef = useRef<SVGSVGElement>(null)
  useMascotAnimation(svgRef, activeMood, onPeekEnd)
  const checkId = `mm-chk-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
  const a11y = label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true as const }

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 240 304"
      className={cn('h-48 w-auto overflow-visible', className)}
      style={{ color: BRAND_INK }}
      data-mood={activeMood}
      {...a11y}
    >
      <defs>
        <pattern id={checkId} width="10" height="10" patternUnits="userSpaceOnUse">
          <rect width="10" height="10" className="fill-oat" />
          <path d="M0 0h5v5H0zM5 5h5v5H5z" fill="currentColor" />
        </pattern>
      </defs>
      <g data-part="rig" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
        <g data-part="legs">
          <path d="M108 270v18M136 270v18" />
          <path d="M94 300c0-9 6-13 14-13s11 5 11 13zM126 300c0-8 3-13 11-13s14 4 14 13z" fill="currentColor" />
        </g>
        <g data-part="body">
          <path d="M98 222c-12 18-12 40 2 50h44c14-10 14-32 2-50z" className="fill-oat" />
        </g>

        <g data-part="head" transform="rotate(-12 128 168)">
          <g fill="currentColor" stroke="none">
            <path d="M62 148L110 150 112 232 70 240 38 200z" />
            <circle cx="60" cy="156" r="17" /><circle cx="44" cy="180" r="17" /><circle cx="44" cy="206" r="16" />
            <circle cx="58" cy="228" r="16" /><circle cx="80" cy="240" r="15" /><circle cx="102" cy="238" r="12" />
            <circle cx="198" cy="148" r="12" /><circle cx="204" cy="168" r="11" /><circle cx="196" cy="186" r="9" />
          </g>
          <path d="M58 170c0-40 30-66 74-66 42 0 74 28 74 66 0 38-36 62-78 62-42 0-70-24-70-62z" className="fill-oat" />
          <g fill="currentColor" stroke="none">
            <path d="M56 160l50-8 6 60-14 16-40-6z" />
            <circle cx="104" cy="214" r="9" /><circle cx="90" cy="226" r="11" />
          </g>
          <path d="M78 214c-11-4-19 7-12 17 4 6 12 8 18 2" className="fill-oat" />
          <path d="M69 224h9M73.5 219v10" strokeWidth="3.5" />
          <g fill="currentColor" stroke="none">
            <path d="M112 134L200 112 206 140 116 150z" />
            <circle cx="124" cy="146" r="9" /><circle cx="141" cy="148" r="10" /><circle cx="160" cy="146" r="10" />
            <circle cx="179" cy="140" r="10" /><circle cx="196" cy="142" r="9" />
          </g>
          <g data-part="cap">
            <path d="M50 162c-14-36 16-72 64-76 40-2 68 18 76 40-30-12-82-6-110 22-12 12-22 16-30 14z" className="fill-oat" />
            <path d="M100 142c30-24 70-30 102-20" />
            <path d="M64 112c-9-4-9-17 1-19 7-1 11 3 12 9" className="fill-oat" />
          </g>
          <MascotFace pose={pose} />
        </g>

        {/* arms in front of the head so a raised (waving) arm stays visible */}
        {arm('armL', ARM_ROTATION.armL[pose.armL], 'M100 242c-12 6-18 14-20 24', [79, 270])}
        {arm('armR', ARM_ROTATION.armR[pose.armR], 'M146 240c12 4 18 14 20 24', [167, 270])}

        <g data-part="accessory" transform="rotate(-10 156 80)">
          <path d="M104 84h108v12H104z" fill={`url(#${checkId})`} strokeWidth="5" />
          <path d="M110 48h42l-4 36h-34z" className="fill-oat" />
          <path d="M110 48c6-7 36-7 42 0-6 6-36 6-42 0z" fill="currentColor" strokeWidth="4" />
          <path d="M112 58c-16-2-18 18-2 20" strokeWidth="5" />
          <path d="M131 58c-7 5-7 16 0 19 7-3 7-14 0-19z" fill="currentColor" stroke="none" />
          <path d="M152 72c0-17 38-17 38 0z" className="fill-oat" strokeWidth="5" />
          <path d="M152 76c4 4 9-2 13 1s9-2 13 1 8-1 12 0" strokeWidth="4" />
          <path d="M153 80h36v4h-36z" fill="currentColor" strokeWidth="4" />
          <path d="M193 86l3-42 18 4-6 38z" className="fill-oat" strokeWidth="5" />
          <path d="M195 48c0-9 8-13 12-8 5-3 12 2 8 10z" fill="currentColor" strokeWidth="3" />
          <g fill="currentColor" stroke="none">
            <circle cx="163" cy="65" r="1.5" /><circle cx="171" cy="62" r="1.5" /><circle cx="179" cy="66" r="1.5" />
            <circle cx="203" cy="62" r="1.6" /><circle cx="203" cy="74" r="1.6" />
          </g>
          <g data-part="steam" fill="currentColor" stroke="none">
            <path d="M119 40c-9-8 4-14-2-26 10 6 12 18 2 26z" />
            <path d="M131 38c-10-10 6-17-1-32 12 8 14 22 1 32z" />
            <path d="M143 40c-9-8 4-14-2-26 10 6 12 18 2 26z" />
          </g>
        </g>

        {pose.extra === 'zzz' && (
          <g data-part="zzz" fill="currentColor" stroke="none" className="font-hand" fontWeight="700">
            <text x="196" y="130" fontSize="26">z</text>
            <text x="212" y="108" fontSize="20">z</text>
            <text x="224" y="90" fontSize="14">z</text>
          </g>
        )}
        {pose.extra === 'sparkles' && (
          <g data-part="sparkles" className="fill-cheese" strokeWidth="3">
            <path d="M30 120l4 10 10 4-10 4-4 10-4-10-10-4 10-4z" />
            <path d="M214 196l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" />
          </g>
        )}
      </g>
    </svg>
  )
}
