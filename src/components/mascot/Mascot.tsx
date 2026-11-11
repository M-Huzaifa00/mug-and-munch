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
 * Munchy, the Mug n Munch kid, chibi + kawaii: big round face framed by curls, cap with curly bangs, huge sparkly
 * eyes, rosy cheeks, happy smile with a tiny tongue, little heart, balancing the café tray. Built from the logo. Each mood = static pose (reduced motion) + GSAP timeline.
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
          <path d="M98 224c-12 18-12 40 2 48h44c14-8 14-30 2-48z" className="fill-oat" />
          {/* little heart on the chest */}
          <path d="M122 260c-7-5-10-8-10-12 0-3 3-5 6-5 2 0 3 1 4 3 1-2 2-3 4-3 3 0 6 2 6 5 0 4-3 7-10 12z" className="fill-chili" strokeWidth="2.5" />
        </g>

        <g data-part="head">
          {/* curls sit BEHIND the face: they frame the head, never cover it */}
          <g fill="currentColor" stroke="none">
            <circle cx="64" cy="146" r="16" /><circle cx="53" cy="170" r="15" /><circle cx="56" cy="196" r="14" /><circle cx="68" cy="216" r="12" />
            <circle cx="184" cy="146" r="16" /><circle cx="195" cy="170" r="15" /><circle cx="192" cy="196" r="14" /><circle cx="180" cy="216" r="12" />
          </g>
          {/* big round face */}
          <ellipse cx="124" cy="176" rx="68" ry="58" className="fill-oat" />
          {/* soft cap with a seam (the tray balances on top) */}
          <g data-part="cap">
            <path d="M56 152c-2-36 28-60 68-60s70 24 68 60c-22-10-46-14-68-14s-46 4-68 14z" className="fill-oat" />
            {/* little brim tilted to the side, like the logo cap */}
            <path d="M168 142c14-8 32-8 42 2-10 6-26 8-40 6z" className="fill-oat" strokeWidth="4" />
            <path d="M84 118c16-8 46-10 74 0" fill="none" strokeWidth="4" />
          </g>
          {/* scalloped curly bangs peeking under the brim */}
          <path
            d="M64 150Q124 132 184 150l0 2q-8 11-17 2q-8 11-17 2q-8 11-17 2q-8 11-17 2q-8 11-17 2q-8 11-17 2q-6 9-14 0z"
            fill="currentColor"
            strokeWidth="3"
          />
          <MascotFace pose={pose} />
        </g>

        {/* arms in front of the head so a raised (waving) arm stays visible */}
        {arm('armL', ARM_ROTATION.armL[pose.armL], 'M100 242c-12 6-18 14-20 24', [79, 270])}
        {arm('armR', ARM_ROTATION.armR[pose.armR], 'M146 240c12 4 18 14 20 24', [167, 270])}

        <g data-part="accessory" transform="translate(-36 -2) rotate(-6 156 80)">
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
