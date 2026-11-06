import { site, type DayHours, type DayKey } from '@/config/site'

const DAYS: DayKey[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
const WEEKDAY_TO_INDEX: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }

export const DAY_LABELS: Record<DayKey, string> = {
  mon: 'Monday',
  tue: 'Tuesday',
  wed: 'Wednesday',
  thu: 'Thursday',
  fri: 'Friday',
  sat: 'Saturday',
  sun: 'Sunday',
}

export const WEEK_ORDER: DayKey[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

const toMinutes = (hhmm: string): number => {
  const [h = '0', m = '0'] = hhmm.split(':')
  return Number(h) * 60 + Number(m)
}

/** "14:00" → "2 PM", "02:30" → "2:30 AM" */
export function formatTime(hhmm: string): string {
  const total = toMinutes(hhmm)
  const h24 = Math.floor(total / 60) % 24
  const m = total % 60
  const suffix = h24 >= 12 ? 'PM' : 'AM'
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12
  return m === 0 ? `${h12} ${suffix}` : `${h12}:${String(m).padStart(2, '0')} ${suffix}`
}

export function formatDayHours(hours: DayHours): string {
  return hours ? `${formatTime(hours.open)} – ${formatTime(hours.close)}` : 'Closed'
}

/** Current weekday index (0 = Sun) and minutes since midnight, in the café's timezone. */
function nowInCafeTz(date: Date): { day: number; minutes: number } {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: site.timezone,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date)
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '0'
  return {
    day: WEEKDAY_TO_INDEX[get('weekday')] ?? 0,
    minutes: Number(get('hour')) * 60 + Number(get('minute')),
  }
}


const hoursFor = (dayIndex: number): DayHours => site.hours[DAYS[(dayIndex + 7) % 7] ?? 'mon']

export type OpenStatus = {
  isOpen: boolean
  /** e.g. "till 2 AM" / "opens 2 PM" / "opens tomorrow 12 PM" */
  detail: string
  /** e.g. "Open now 🟢 · till 2 AM" */
  label: string
}

const status = (isOpen: boolean, detail: string): OpenStatus => ({
  isOpen,
  detail,
  label: `${isOpen ? 'Open now 🟢' : 'Closed 🔴'}${detail ? ` · ${detail}` : ''}`,
})

/** Today's weekday key in Asia/Karachi. */
export function getTodayKey(date: Date = new Date()): DayKey {
  return DAYS[nowInCafeTz(date).day] ?? 'mon'
}

export function getOpenStatus(date: Date = new Date()): OpenStatus {
  const { day, minutes } = nowInCafeTz(date)

  // 1) Still inside yesterday's after-midnight window (e.g. Mon 12 PM → Tue 2 AM)?
  const yesterday = hoursFor(day - 1)
  if (yesterday) {
    const open = toMinutes(yesterday.open)
    const close = toMinutes(yesterday.close)
    if (close <= open && minutes < close) return status(true, `till ${formatTime(yesterday.close)}`)
  }

  // 2) Today's window.
  const today = hoursFor(day)
  if (today) {
    const open = toMinutes(today.open)
    const close = toMinutes(today.close)
    const overnight = close <= open
    if (minutes >= open && (overnight || minutes < close)) return status(true, `till ${formatTime(today.close)}`)
    if (minutes < open) return status(false, `opens ${formatTime(today.open)}`)
  }

  // 3) Find the next opening day.
  for (let i = 1; i <= 7; i++) {
    const next = hoursFor(day + i)
    if (next) {
      const when = i === 1 ? 'tomorrow' : DAY_LABELS[DAYS[(day + i) % 7] ?? 'mon']
      return status(false, `opens ${when} ${formatTime(next.open)}`)
    }
  }
  return status(false, '')
}
