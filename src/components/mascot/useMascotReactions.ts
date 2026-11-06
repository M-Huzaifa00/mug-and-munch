import { useEffect, useState } from 'react'
import { useCart } from '@/store/cart'
import type { MascotMood } from './mascotPoses'

const WAVE_MS = 2600
const EXCITED_MS = 1500
const SLEEP_AFTER_MS = 30_000
const ACTIVITY = ['pointermove', 'pointerdown', 'keydown', 'scroll', 'touchstart'] as const

/**
 * Global reactions: first add of the session → wave, any other add → excited,
 * 30s with no interaction → sleep (wakes on any activity). Returns the mood to render.
 */
export function useMascotReactions(baseMood: MascotMood, enabled: boolean): MascotMood {
  const [reaction, setReaction] = useState<MascotMood | null>(null)
  const [asleep, setAsleep] = useState(false)

  // Cart events.
  useEffect(() => {
    if (!enabled) return
    let timer = 0
    const unsub = useCart.subscribe((state, prev) => {
      if (!state.lastAdd || state.lastAdd === prev.lastAdd) return
      const first = !prev.hasAddedThisSession && state.hasAddedThisSession
      setAsleep(false)
      setReaction(first ? 'wave' : 'excited')
      window.clearTimeout(timer)
      timer = window.setTimeout(() => setReaction(null), first ? WAVE_MS : EXCITED_MS)
    })
    return () => {
      unsub()
      window.clearTimeout(timer)
    }
  }, [enabled])

  // Idle → sleep.
  useEffect(() => {
    if (!enabled) return
    let timer = window.setTimeout(() => setAsleep(true), SLEEP_AFTER_MS)
    const wake = () => {
      setAsleep(false)
      window.clearTimeout(timer)
      timer = window.setTimeout(() => setAsleep(true), SLEEP_AFTER_MS)
    }
    for (const e of ACTIVITY) window.addEventListener(e, wake, { passive: true })
    return () => {
      window.clearTimeout(timer)
      for (const e of ACTIVITY) window.removeEventListener(e, wake)
    }
  }, [enabled])

  if (!enabled) return baseMood
  return reaction ?? (asleep ? 'sleep' : baseMood)
}
