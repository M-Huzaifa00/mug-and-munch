import { describe, expect, it } from 'vitest'
import { formatPkMobile, formatPkMobileInput, normalizePkMobile, toWaDigits } from '@/lib/phone'

describe('normalizePkMobile', () => {
  it.each(['03001234567', '0300-1234567', '+923001234567', '923001234567', '92 300 1234567', ' 0300 123 4567 ', '+92 (300) 123-4567', '00923001234567'])('accepts %s', (input) => {
    expect(normalizePkMobile(input)).toBe('03001234567')
  })

  it.each([
    ['0400-1234567', 'not a mobile prefix'],
    ['0300123456', 'too short'],
    ['030012345678', 'too long'],
    ['+933001234567', 'wrong country'],
    ['0300-12345ab', 'letters'],
    ['', 'empty'],
    ['3001234567', 'missing leading 0'],
    ['051-1234567', 'landline'],
  ])('rejects %s (%s)', (input) => {
    expect(normalizePkMobile(input)).toBeNull()
  })
})

describe('formatPkMobileInput (live typing)', () => {
  it('formats progressively as 03XX-XXXXXXX', () => {
    expect(formatPkMobileInput('0')).toBe('0')
    expect(formatPkMobileInput('0300')).toBe('0300')
    expect(formatPkMobileInput('03001')).toBe('0300-1')
    expect(formatPkMobileInput('03001234567')).toBe('0300-1234567')
  })
  it('caps at 11 digits and converts +92', () => {
    expect(formatPkMobileInput('0300123456789')).toBe('0300-1234567')
    expect(formatPkMobileInput('+92 300 1234567')).toBe('0300-1234567')
  })
  it('strips non-digits', () => {
    expect(formatPkMobileInput('0300-12a34')).toBe('0300-1234')
  })
})

describe('toWaDigits / formatPkMobile', () => {
  it('returns 923XXXXXXXXX', () => {
    expect(toWaDigits('0300-1234567')).toBe('923001234567')
    expect(toWaDigits('+923211234567')).toBe('923211234567')
    expect(toWaDigits('12345')).toBeNull()
  })
  it('display form', () => {
    expect(formatPkMobile('923001234567')).toBe('0300-1234567')
  })
})
