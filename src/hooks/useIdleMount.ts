import { useEffect, useState } from 'react'

/** True once `enabled` and the browser is idle (requestIdleCallback, setTimeout fallback). For non-critical extras. */
export function useIdleMount(enabled: boolean, timeoutMs = 1500): boolean {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!enabled || ready) return
    const done = () => setReady(true)
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(done, { timeout: timeoutMs })
      return () => window.cancelIdleCallback(id)
    }
    const id = globalThis.setTimeout(done, 400)
    return () => globalThis.clearTimeout(id)
  }, [enabled, ready, timeoutMs])

  return ready
}
