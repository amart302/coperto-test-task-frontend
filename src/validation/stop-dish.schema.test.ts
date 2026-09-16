import { describe, expect, it } from 'vitest'
import { stopDishSchema } from './stop-dish.schema'

describe('stopDishSchema', () => {
  it.each([15, 60, 720])('accepts valid duration %i', (durationMinutes) => {
    expect(
      stopDishSchema.safeParse({
        reason: 'Нет ингредиента',
        durationMinutes,
      }).success,
    ).toBe(true)
  })

  it.each([14, 720.5, 721])('rejects invalid duration %s', (durationMinutes) => {
    expect(
      stopDishSchema.safeParse({
        reason: 'Нет ингредиента',
        durationMinutes,
      }).success,
    ).toBe(false)
  })

  it('rejects a whitespace-only reason', () => {
    expect(
      stopDishSchema.safeParse({ reason: '     ', durationMinutes: 60 }).success,
    ).toBe(false)
  })
})
