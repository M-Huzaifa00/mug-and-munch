import { useSyncExternalStore } from 'react'

export const PRELOADER_KEY = 'mm-preloaded'
/** Static first frame in index.html (shown before JS); the React preloader replaces it seamlessly. */
const BOOT_ID = 'mm-boot'

/** First visit of the session + motion allowed → show the home preloader. index.html mirrors this check. */
export function shouldShowPreloader(): boolean {
  try {
    return !sessionStorage.getItem(PRELOADER_KEY) && window.matchMedia('(prefers-reduced-motion: no-preference)').matches
  } catch {
    return false
  }
}

export function markPreloaderSeen() {
  try {
    sessionStorage.setItem(PRELOADER_KEY, '1')
  } catch {
    /* private mode: preloader may show again, harmless */
  }
}

/**
 * Preloader phase, shared by the app shell (renders it) and Home (waits for it):
 * loading → (curtain lifts, Home intro plays) revealing → done (unmounted).
 * Decided once at startup so the very first render already knows: no Suspense loader before the 0→100.
 */
export type PreloaderPhase = 'loading' | 'revealing' | 'done'
let phase: PreloaderPhase = typeof window !== 'undefined' && window.location.pathname === '/' && shouldShowPreloader() ? 'loading' : 'done'
let homeReady = false
const listeners = new Set<() => void>()
const emit = () => listeners.forEach((l) => l())
const subscribe = (l: () => void) => {
  listeners.add(l)
  return () => listeners.delete(l)
}

export const usePreloaderPhase = () => useSyncExternalStore(subscribe, () => phase)

export function setPreloaderPhase(next: PreloaderPhase) {
  if (phase === next) return
  phase = next
  if (next !== 'loading') markPreloaderSeen()
  emit()
}

/** Home calls this once mounted; the preloader holds near the end of its count until then. */
export function markHomeReady() {
  if (homeReady) return
  homeReady = true
  emit()
}

/** Resolves when Home is mounted (or after `maxMs`, so a slow network never traps the visitor). */
export function whenHomeReady(maxMs: number): Promise<void> {
  if (homeReady) return Promise.resolve()
  return new Promise((resolve) => {
    const timer = window.setTimeout(done, maxMs)
    const unsub = subscribe(() => homeReady && done())
    function done() {
      window.clearTimeout(timer)
      unsub()
      resolve()
    }
  })
}

/** Remove the static index.html first frame (no-op when it isn't there). */
export function removeBootScreen() {
  document.getElementById(BOOT_ID)?.remove()
  document.documentElement.classList.remove(BOOT_ID)
}
