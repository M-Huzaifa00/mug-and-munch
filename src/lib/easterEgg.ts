export const SPILL_EVENT = 'mm:coffee-spill'

const CLICKS_NEEDED = 5
const WINDOW_MS = 2000
let clicks: number[] = []

/** Call on every navbar-logo click; the 5th click within 2s triggers the coffee spill. */
export function registerLogoClick(now = Date.now()) {
  clicks = [...clicks.filter((t) => now - t < WINDOW_MS), now]
  if (clicks.length >= CLICKS_NEEDED) {
    clicks = []
    window.dispatchEvent(new Event(SPILL_EVENT))
  }
}
