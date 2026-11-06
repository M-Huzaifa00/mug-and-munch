import { useState } from 'react'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { Mascot } from '@/components/mascot/Mascot'
import type { MascotMood } from '@/components/mascot/mascotPoses'

/** Munchy peeks in from the bottom-right corner, then follows the cursor (desktop) or idles (touch). */
export function HeroMascot() {
  const fine = useMediaQuery('(hover: hover) and (pointer: fine)')
  const [mood, setMood] = useState<MascotMood>('peek')

  return (
    <div className="pointer-events-none absolute right-1 bottom-0 z-10 h-36 w-28 overflow-hidden sm:right-4 sm:h-52 sm:w-40 md:right-24 lg:h-64 lg:w-52">
      <Mascot
        mood={mood}
        reactive
        onPeekEnd={() => setMood(fine ? 'follow' : 'idle')}
        className="absolute bottom-[-4%] h-full w-full"
        label="Munchy, the Mug n Munch mascot"
      />
    </div>
  )
}
