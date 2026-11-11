import { useState, type ReactNode } from 'react'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { MQ } from '@/lib/gsap'
import { cn } from '@/lib/utils'
import { Mascot } from '@/components/mascot/Mascot'
import type { MascotMood } from '@/components/mascot/mascotPoses'

/**
 * Munchy hides BEHIND the hero's Order Now button: a clipped window whose bottom sits at the button's middle,
 * so he rises from behind it (peek mood), waves, looks around, then settles (follows the cursor on desktop,
 * idles on touch) while a speech bubble says "psst… order here! 👇". Hover / focus the button → he jumps
 * (excited) and the bubble cheers. Decorative (aria-hidden); the button itself is unchanged.
 * Reduced motion: static pose + bubble.
 */
export function HeroOrderPeek({ play, children }: { play: boolean; children: ReactNode }) {
  const fine = useMediaQuery(MQ.finePointer)
  const reduced = useReducedMotion()
  const [settledMood, setSettledMood] = useState<MascotMood | null>(null)
  const [hot, setHot] = useState(false)
  const settled = reduced || settledMood !== null
  const mood: MascotMood = hot && settled ? 'excited' : (settledMood ?? 'peek')

  return (
    <div
      className="relative mt-24 md:mt-0"
      onPointerEnter={() => setHot(true)}
      onPointerLeave={() => setHot(false)}
      onFocusCapture={() => setHot(true)}
      onBlurCapture={() => setHot(false)}
    >
      {play && (
        <div aria-hidden="true" className="pointer-events-none absolute bottom-1/2 left-2 h-40 w-28 overflow-hidden md:left-3 md:w-32">
          <Mascot mood={mood} onPeekEnd={() => setSettledMood(fine ? 'follow' : 'idle')} className="absolute -bottom-1 left-0 h-28 w-auto md:h-32" />
        </div>
      )}

      <div className="relative z-10">{children}</div>

      {play && (
        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute -top-[4.6rem] left-[6.2rem] z-20 origin-bottom-left transition-[scale,opacity] duration-500 ease-bouncy md:left-[7rem]',
            settled ? 'scale-100 opacity-100' : 'scale-0 opacity-0',
          )}
        >
          <span className="sticker relative block -rotate-3 rounded-2xl bg-oat px-3 py-1 font-hand text-xl whitespace-nowrap text-ink md:text-2xl">
            {hot ? 'yes, that one! 😋' : 'psst… order here! 👇'}
            {/* bubble tail pointing at Munchy */}
            <span className="absolute -bottom-[7px] left-3 size-3 rotate-45 border-r-[2.5px] border-b-[2.5px] border-espresso bg-oat" />
          </span>
        </span>
      )}
    </div>
  )
}
