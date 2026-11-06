import { DAY_LABELS, hoursFor, nowInCafeTz, toMinutes } from '@/lib/hours'

export interface PickupSlot {
  /** Goes into the order + WhatsApp message ("ASAP", "Today 9:30 PM"). */
  value: string
  label: string
}

export interface PickupPlan {
  isOpen: boolean
  slots: PickupSlot[]
}

const STEP = 30
/** Earliest slot is at least this far from now / opening (prep time). */
const LEAD = 20
/** Last slot at least this long before closing. */
const BEFORE_CLOSE = 30
const MAX_SLOTS = 10
const DAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const

const clock = (min: number) => {
  const m = ((min % 1440) + 1440) % 1440
  const h24 = Math.floor(m / 60)
  const mm = m % 60
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12
  return `${h12}${mm ? `:${String(mm).padStart(2, '0')}` : ''} ${h24 >= 12 ? 'PM' : 'AM'}`
}

/** Opening windows as minutes relative to TODAY 00:00 (café timezone). Overnight windows run past 1440. */
function windows(day: number): [number, number][] {
  const out: [number, number][] = []
  for (let d = -1; d <= 7; d++) {
    const h = hoursFor(day + d)
    if (!h) continue
    const open = toMinutes(h.open)
    const close = toMinutes(h.close)
    out.push([d * 1440 + open, d * 1440 + close + (close <= open ? 1440 : 0)])
  }
  return out
}

/**
 * Takeaway pickup times from the real hours in site.ts (Asia/Karachi, overnight aware).
 * Open → "ASAP" + 30-minute slots until shortly before close. Closed → only slots from the next opening.
 */
export function getPickupPlan(date: Date = new Date()): PickupPlan {
  const { day, minutes: now } = nowInCafeTz(date)
  const all = windows(day)
  const current = all.find(([a, b]) => now >= a && now < b)
  const win = current ?? all.filter(([a]) => a > now).sort((x, y) => x[0] - y[0])[0]
  if (!win) return { isOpen: false, slots: [] }

  const from = Math.max(win[0], now) + LEAD
  const slots: PickupSlot[] = current ? [{ value: 'ASAP', label: 'ASAP' }] : []
  for (let t = Math.ceil(from / STEP) * STEP; t <= win[1] - BEFORE_CLOSE && slots.length < MAX_SLOTS; t += STEP) {
    const offset = Math.floor(t / 1440)
    const startedToday = Math.floor(win[0] / 1440) <= 0
    const dayName =
      offset <= 0 ? 'Today' : offset === 1 && startedToday && t % 1440 < 6 * 60 ? 'Tonight' : offset === 1 ? 'Tomorrow' : DAY_LABELS[DAY_KEYS[(day + offset) % 7]!]
    const value = `${dayName} ${clock(t)}`
    slots.push({ value, label: value })
  }
  return { isOpen: Boolean(current), slots }
}
