import { useSyncExternalStore } from 'react'

/** Static first frame in index.html (shown before JS); the React preloader replaces it seamlessly. */
const BOOT_ID = 'mm-boot'

/**
 * The 0→100 preloader is THE loading screen: it runs on every full page load (any route; in-app navigation
 * never shows it). Phase, shared by the app shell (renders it) and pages (wait for it):
 * loading → (curtain lifts, page intro plays) revealing → done (unmounted).
 * Reduced motion still gets it, as a calm version (count + fade, no wave / slide).
 */
export type PreloaderPhase = 'loading' | 'revealing' | 'done'
let phase: PreloaderPhase = typeof window === 'undefined' ? 'done' : 'loading'
let pageReady = false
const listeners = new Set<() => void>()
const emit = () => listeners.forEach((l) => l())
const subscribe = (l: () => void) => {
  listeners.add(l)
  return () => listeners.delete(l)
}

export const usePreloaderPhase = () => useSyncExternalStore(subscribe, () => phase)
export const getPreloaderPhase = () => phase

export function setPreloaderPhase(next: PreloaderPhase) {
  if (phase === next) return
  phase = next
  emit()
}

/** The routed page has mounted (its lazy chunk resolved); RootLayout's <PageReady /> calls this. */
export function markPageReady() {
  if (pageReady) return
  pageReady = true
  emit()
}

/** Resolves when the first page is mounted (or after `maxMs`, so a slow network never traps the visitor). */
export function whenPageReady(maxMs: number): Promise<void> {
  if (pageReady) return Promise.resolve()
  return new Promise((resolve) => {
    const timer = window.setTimeout(done, maxMs)
    const unsub = subscribe(() => pageReady && done())
    function done() {
      window.clearTimeout(timer)
      unsub()
      resolve()
    }
  })
}

/** Resolves once the preloader has fully finished (phase `done`). */
export function whenPreloaderDone(): Promise<void> {
  if (phase === 'done') return Promise.resolve()
  return new Promise((resolve) => {
    const unsub = subscribe(() => {
      if (phase !== 'done') return
      unsub()
      resolve()
    })
  })
}

/**
 * Home only: the preloader's ink drawing flies onto the hero sketch instead of lifting with the curtain.
 * Set by the preloader BEFORE `revealing`; the hero then keeps its lines drawn and only prints the colours in.
 */
let sketchHandoff = false
export const setSketchHandoff = (v: boolean) => {
  sketchHandoff = v
}
export const getSketchHandoff = () => sketchHandoff

/** Remove the static index.html first frame (no-op when it isn't there). */
export function removeBootScreen() {
  document.getElementById(BOOT_ID)?.remove()
  document.documentElement.classList.remove(BOOT_ID)
}
