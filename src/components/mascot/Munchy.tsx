import { cn } from '@/lib/utils'

export type MunchyMood = 'happy' | 'sleepy' | 'oops'

interface MunchyProps {
  mood?: MunchyMood
  className?: string
  /** Accessible description; omit to make it decorative. */
  label?: string
}

/**
 * Munchy: chubby smiling coffee-mug mascot with tiny legs and big eyes. Original design.
 * Phase 2 = static moods. Phase 3 adds blinking, eye tracking (pupils are tagged data-pupil),
 * waving and idle sleep.
 */
export function Munchy({ mood = 'happy', className, label }: MunchyProps) {
  const a11y = label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true as const }

  return (
    <svg viewBox="0 0 150 160" className={cn('h-40 w-36', className)} {...a11y}>
      {/* steam / zZz */}
      {mood === 'sleepy' ? (
        <g className="fill-espresso font-hand" fontWeight="700">
          <text x="104" y="30" fontSize="22" className="animate-float">z</text>
          <text x="118" y="16" fontSize="16" className="animate-float">z</text>
          <text x="128" y="6" fontSize="12">z</text>
        </g>
      ) : (
        <g className="fill-none stroke-caramel" strokeWidth="4" strokeLinecap="round">
          <path className="animate-steam" d="M54 26q-6-8 0-16" />
          <path className="animate-steam" style={{ animationDelay: '0.6s' }} d="M74 26q-6-8 0-16" />
        </g>
      )}

      {/* legs */}
      <g className="fill-none stroke-espresso" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M50 134v14h-9" />
        <path d="M86 134v14h9" />
      </g>

      {/* handle */}
      <path d="M116 62h7a17 17 0 0 1 0 34h-7" className="fill-none stroke-espresso" strokeWidth="6" strokeLinecap="round" />

      {/* body */}
      <path d="M20 40h96v64a34 34 0 0 1-34 34H54a34 34 0 0 1-34-34z" className="fill-oat stroke-espresso" strokeWidth="5" strokeLinejoin="round" />
      <path d="M22.5 92h91v10H22.5z" className="fill-cheese" />
      <path d="M22.5 92h91M22.5 102h91" className="stroke-espresso" strokeWidth="2.5" />
      {/* coffee top */}
      <ellipse cx="68" cy="40" rx="48" ry="9" className="fill-caramel stroke-espresso" strokeWidth="5" />

      {/* cheeks */}
      <ellipse cx="38" cy="80" rx="7" ry="4.5" className="fill-bubblegum" />
      <ellipse cx="98" cy="80" rx="7" ry="4.5" className="fill-bubblegum" />

      {/* eyes */}
      {mood === 'sleepy' ? (
        <g className="fill-none stroke-espresso" strokeWidth="4" strokeLinecap="round">
          <path d="M42 66q8 7 16 0" />
          <path d="M78 66q8 7 16 0" />
        </g>
      ) : (
        <g>
          <circle cx="50" cy="64" r="11" className="fill-oat stroke-espresso" strokeWidth="3.5" />
          <circle cx="86" cy="64" r="11" className="fill-oat stroke-espresso" strokeWidth="3.5" />
          <g data-pupil>
            <circle cx={mood === 'oops' ? 53 : 51} cy="65" r="5.5" className="fill-espresso" />
            <circle cx={mood === 'oops' ? 55 : 53} cy="62.5" r="1.8" className="fill-oat" />
          </g>
          <g data-pupil>
            <circle cx={mood === 'oops' ? 89 : 87} cy="65" r="5.5" className="fill-espresso" />
            <circle cx={mood === 'oops' ? 91 : 89} cy="62.5" r="1.8" className="fill-oat" />
          </g>
        </g>
      )}

      {/* mouth */}
      {mood === 'happy' && <path d="M58 80q10 11 20 0" className="fill-none stroke-espresso" strokeWidth="4" strokeLinecap="round" />}
      {mood === 'sleepy' && <ellipse cx="68" cy="82" rx="4" ry="3.2" className="fill-espresso" />}
      {mood === 'oops' && (
        <>
          <path d="M57 84q5-5 9 0t9 0" className="fill-none stroke-espresso" strokeWidth="4" strokeLinecap="round" />
          <path d="M112 46q5 8 0 11q-5-3 0-11z" className="fill-oat stroke-espresso" strokeWidth="2.5" />
        </>
      )}
    </svg>
  )
}
