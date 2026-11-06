import type { Deal } from '@/data/deals'
import { formatTime, nowInCafeTz, toMinutes } from '@/lib/hours'

export interface DealWindowStatus {
  /** "Available 11 PM – 2 AM" */
  label: string
  /** "11 PM – 2 AM" */
  range: string
  /** Inside the window right now (Asia/Karachi). */
  isNow: boolean
}

/** Honest availability for deals with a daily window. No countdowns, just the window + "Available now 🟢". */
export function getDealWindow(deal: Pick<Deal, 'window'>, date: Date = new Date()): DealWindowStatus | null {
  if (!deal.window) return null
  const { minutes } = nowInCafeTz(date)
  const start = toMinutes(deal.window.start)
  const end = toMinutes(deal.window.end)
  const isNow = end <= start ? minutes >= start || minutes < end : minutes >= start && minutes < end
  const range = `${formatTime(deal.window.start)} – ${formatTime(deal.window.end)}`
  return { label: `Available ${range}`, range, isNow }
}
