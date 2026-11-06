import { site } from '@/config/site'

/** YYMMDD for the given moment in the café's timezone (Asia/Karachi). */
export function karachiDateStamp(date: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: site.timezone, year: '2-digit', month: '2-digit', day: '2-digit' }).formatToParts(date)
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '00'
  return `${get('year')}${get('month')}${get('day')}`
}

/** 4-char base36 suffix, uppercase. */
function randomSuffix(random: () => number): string {
  let out = ''
  for (let i = 0; i < 4; i++) out += Math.floor(random() * 36).toString(36)
  return out.toUpperCase()
}

/** "MM-261107-4K2Q": prefix from site.ts, date in Asia/Karachi, 4-char base36 random. */
export function createOrderNumber(date: Date = new Date(), random: () => number = Math.random): string {
  return `${site.orderPrefix}-${karachiDateStamp(date)}-${randomSuffix(random)}`
}
