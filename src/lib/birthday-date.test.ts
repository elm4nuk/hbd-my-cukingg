import { describe, expect, it } from 'vitest'
import { getBirthdayCountdown } from './birthday-date'

const now = new Date(2026, 9, 24) // 24 Okt 2026

describe('birthday countdown', () => {
  it('hides when the date is missing or invalid', () => {
    expect(getBirthdayCountdown(null, now)).toBeNull()
    expect(getBirthdayCountdown('', now)).toBeNull()
    expect(getBirthdayCountdown('2026-13-01', now)).toBeNull()
    expect(getBirthdayCountdown('02-30', now)).toBeNull()
  })

  it('detects today and counts forward, rolling over the year', () => {
    expect(getBirthdayCountdown('10-24', now)).toEqual({ isToday: true, days: 0 })
    expect(getBirthdayCountdown('2001-10-31', now)).toEqual({ isToday: false, days: 7 })
    expect(getBirthdayCountdown('10-23', now)).toEqual({ isToday: false, days: 364 })
  })
})
