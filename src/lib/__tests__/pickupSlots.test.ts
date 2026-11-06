import { describe, expect, it } from 'vitest'
import { getPickupPlan } from '@/lib/pickupSlots'
import { getOpenStatus } from '@/lib/hours'

/** Karachi is UTC+5 all year. */
const pkt = (iso: string) => new Date(`${iso}+05:00`)

// site.ts hours: Mon–Thu 12:00 → 02:00, Fri 14:00 → 03:00, Sat 12:00 → 03:00, Sun 12:00 → 02:00.
describe('getPickupPlan', () => {
  it('open in the evening: ASAP + 30-min slots', () => {
    const plan = getPickupPlan(pkt('2026-11-09T20:05')) // Monday 8:05 PM
    expect(plan.isOpen).toBe(true)
    expect(plan.slots[0]!.value).toBe('ASAP')
    expect(plan.slots[1]!.value).toBe('Today 8:30 PM')
    expect(plan.slots.length).toBeGreaterThan(5)
  })

  it('open past midnight (overnight window): slots stop before 2 AM close', () => {
    const plan = getPickupPlan(pkt('2026-11-10T00:40')) // Tuesday 12:40 AM, inside Monday's window
    expect(plan.isOpen).toBe(true)
    expect(getOpenStatus(pkt('2026-11-10T00:40')).isOpen).toBe(true)
    expect(plan.slots.map((s) => s.value)).toEqual(['ASAP', 'Today 1 AM', 'Today 1:30 AM'])
  })

  it('late evening slots that cross midnight say "Tonight"', () => {
    const values = getPickupPlan(pkt('2026-11-09T23:10')).slots.map((s) => s.value)
    expect(values).toContain('Tonight 12:30 AM')
    expect(values.at(-1)).toBe('Tonight 1:30 AM')
  })

  it('closed (after 2 AM): no ASAP, only slots from the next opening', () => {
    const plan = getPickupPlan(pkt('2026-11-10T03:00')) // Tuesday 3 AM, opens 12 PM
    expect(plan.isOpen).toBe(false)
    expect(plan.slots[0]!.value).toBe('Today 12:30 PM')
    expect(plan.slots.some((s) => s.value === 'ASAP')).toBe(false)
  })

  it('closed before Friday 2 PM opening', () => {
    const plan = getPickupPlan(pkt('2026-11-13T13:50')) // Friday 1:50 PM
    expect(plan.isOpen).toBe(false)
    expect(plan.slots[0]!.value).toBe('Today 2:30 PM')
  })
})
