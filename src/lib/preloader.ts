export const PRELOADER_KEY = 'mm-preloaded'

/** First visit of the session + motion allowed → show the home preloader. */
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
