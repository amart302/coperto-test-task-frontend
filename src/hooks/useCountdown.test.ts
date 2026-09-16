import { describe, expect, it } from 'vitest'
import { formatCountdown, getRemainingMilliseconds } from './useCountdown'

describe('countdown helpers', () => {
  it('calculates remaining time from expiresAt', () => {
    expect(
      getRemainingMilliseconds('2026-09-16T12:01:30.000Z',
        new Date('2026-09-16T12:00:00.000Z').getTime()),
    ).toBe(90_000)
  })

  it('never returns a negative remaining time', () => {
    expect(getRemainingMilliseconds('2026-09-16T11:00:00.000Z',
      new Date('2026-09-16T12:00:00.000Z').getTime())).toBe(0)
  })

  it('formats minute and hour countdowns', () => {
    expect(formatCountdown(90_000)).toBe('01:30')
    expect(formatCountdown(3_661_000)).toBe('01:01:01')
  })
})
