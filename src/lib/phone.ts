/**
 * Pakistani mobile numbers: 03XX-XXXXXXX (11 digits, starts with 03).
 * Accepts 03XXXXXXXXX, +923XXXXXXXXX, 923XXXXXXXXX, 00923XXXXXXXXX, with spaces / dashes / brackets.
 */

/** → "03001234567", or null when it isn't a valid PK mobile. */
export function normalizePkMobile(input: string): string | null {
  const raw = input.trim()
  if (!/^[+\d\s\-().]*$/.test(raw)) return null
  let digits = raw.replace(/\D/g, '')
  if (digits.startsWith('0092')) digits = digits.slice(2)
  if (digits.startsWith('92')) digits = `0${digits.slice(2)}`
  return /^03\d{9}$/.test(digits) ? digits : null
}

/** Live input formatting → "03XX-XXXXXXX" (partial input stays partial; never more than 11 digits). */
export function formatPkMobileInput(input: string): string {
  let digits = input.replace(/\D/g, '')
  if (digits.startsWith('0092')) digits = digits.slice(2)
  if (digits.startsWith('92')) digits = `0${digits.slice(2)}`
  digits = digits.slice(0, 11)
  return digits.length > 4 ? `${digits.slice(0, 4)}-${digits.slice(4)}` : digits
}

/** Display form "0300-1234567", or the input unchanged when invalid. */
export function formatPkMobile(input: string): string {
  const n = normalizePkMobile(input)
  return n ? `${n.slice(0, 4)}-${n.slice(4)}` : input
}

/** wa.me digits → "923001234567", or null when invalid. */
export function toWaDigits(input: string): string | null {
  const n = normalizePkMobile(input)
  return n ? `92${n.slice(1)}` : null
}
