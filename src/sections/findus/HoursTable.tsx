import { useState } from 'react'
import { site } from '@/config/site'
import { DAY_LABELS, formatDayHours, getTodayKey, toMinutes, WEEK_ORDER } from '@/lib/hours'
import { cn } from '@/lib/utils'

/** Full week, today highlighted (Asia/Karachi). After-midnight closing times are marked so they read right. */
export function HoursTable() {
  const [today] = useState(() => getTodayKey())

  return (
    <table className="w-full text-left text-espresso">
      <caption className="sr-only">Opening hours (Islamabad time)</caption>
      <tbody>
        {WEEK_ORDER.map((day) => {
          const h = site.hours[day]
          const overnight = h ? toMinutes(h.close) <= toMinutes(h.open) : false
          const isToday = day === today
          return (
            <tr key={day} aria-current={isToday ? 'date' : undefined} className={cn('border-b-2 border-espresso/10 last:border-0', isToday && 'bg-cheese')}>
              <th scope="row" className={cn('py-2.5 pl-3 font-bold', isToday && 'font-extrabold')}>
                {DAY_LABELS[day]}
                {isToday && <span className="ml-2 rounded-full bg-espresso px-2 py-0.5 text-xs text-oat">Today</span>}
              </th>
              <td className="py-2.5 pr-3 text-right font-semibold">
                {formatDayHours(h)}
                {overnight && <span className="block text-xs font-medium text-ink/75">closes after midnight</span>}
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
