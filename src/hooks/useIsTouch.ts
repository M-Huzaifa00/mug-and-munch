import { useSyncExternalStore } from 'react'

const QUERY = '(hover: none), (pointer: coarse)'

function subscribe(onChange: () => void): () => void {
  const mql = window.matchMedia(QUERY)
  mql.addEventListener('change', onChange)
  return () => mql.removeEventListener('change', onChange)
}

const getSnapshot = () => window.matchMedia(QUERY).matches
const getServerSnapshot = () => true

/** True on touch-first devices (phones/tablets). */
export function useIsTouch(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

/** Low-end guard: few CPU cores OR touch device → lighter animation paths. */
export function isLowEndDevice(): boolean {
  if (typeof window === 'undefined') return true
  const cores = navigator.hardwareConcurrency ?? 4
  return cores <= 4 || window.matchMedia(QUERY).matches
}
