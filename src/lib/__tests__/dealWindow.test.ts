import { describe, expect, it } from 'vitest'
import { getDealWindow } from '@/lib/dealWindow'

const pkt = (iso: string) => new Date(`${iso}+05:00`)
const midnight = { window: { start: '23:00', end: '02:00' } }

describe('getDealWindow (Asia/Karachi)', () => {
  it('labels the window', () => {
    expect(getDealWindow(midnight, pkt('2026-11-09T12:00'))).toEqual({ label: 'Available 11 PM – 2 AM', isNow: false })
  })
  it('is "now" inside an overnight window, on both sides of midnight', () => {
    expect(getDealWindow(midnight, pkt('2026-11-09T23:30'))?.isNow).toBe(true)
    expect(getDealWindow(midnight, pkt('2026-11-10T01:59'))?.isNow).toBe(true)
    expect(getDealWindow(midnight, pkt('2026-11-10T02:00'))?.isNow).toBe(false)
  })
  it('same-day windows', () => {
    const lunch = { window: { start: '12:00', end: '15:00' } }
    expect(getDealWindow(lunch, pkt('2026-11-09T14:59'))?.isNow).toBe(true)
    expect(getDealWindow(lunch, pkt('2026-11-09T15:00'))?.isNow).toBe(false)
  })
  it('no window → null', () => {
    expect(getDealWindow({}, new Date())).toBeNull()
  })
})
