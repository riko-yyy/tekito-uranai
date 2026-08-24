import { describe, expect, it } from 'vitest'
import { formatJapaneseDate, getDateKey, hasDrawnToday, parseDateKey, pickActionForDate } from './fortune'
import type { Action } from '../data/types'

function makeAction(id: string): Action {
  return {
    id,
    category: 'life',
    text: `text-${id}`,
    reason: `reason-${id}`,
    actionRating: 3,
    luckyColor: '緑',
    icon: 'star',
  }
}

describe('getDateKey', () => {
  it('formats as YYYY-MM-DD with zero-padding', () => {
    expect(getDateKey(new Date(2026, 0, 5))).toBe('2026-01-05')
    expect(getDateKey(new Date(2026, 11, 31))).toBe('2026-12-31')
  })
})

describe('parseDateKey', () => {
  it('round-trips with getDateKey without a timezone shift', () => {
    const original = new Date(2026, 7, 24)
    const key = getDateKey(original)
    const parsed = parseDateKey(key)
    expect(parsed.getFullYear()).toBe(2026)
    expect(parsed.getMonth()).toBe(7)
    expect(parsed.getDate()).toBe(24)
  })
})

describe('formatJapaneseDate', () => {
  it('renders month/day/weekday in Japanese', () => {
    // 2026-08-24 is a Monday
    expect(formatJapaneseDate(new Date(2026, 7, 24))).toBe('8月24日(月)')
  })
})

describe('pickActionForDate', () => {
  const actions = [makeAction('a'), makeAction('b'), makeAction('c'), makeAction('d')]

  it('is deterministic for the same date key', () => {
    const first = pickActionForDate(actions, '2026-08-24')
    const second = pickActionForDate(actions, '2026-08-24')
    expect(second).toBe(first)
  })

  it('can return different actions for different date keys', () => {
    const results = new Set(
      ['2026-08-24', '2026-08-25', '2026-08-26', '2026-08-27', '2026-08-28'].map(
        (key) => pickActionForDate(actions, key).id,
      ),
    )
    expect(results.size).toBeGreaterThan(1)
  })

  it('throws when there are no actions to pick from', () => {
    expect(() => pickActionForDate([], '2026-08-24')).toThrow()
  })
})

describe('hasDrawnToday', () => {
  it('is false when nothing has been drawn yet', () => {
    expect(hasDrawnToday(null, '2026-08-24')).toBe(false)
  })

  it('is true only when the last drawn date matches today', () => {
    expect(hasDrawnToday('2026-08-24', '2026-08-24')).toBe(true)
    expect(hasDrawnToday('2026-08-23', '2026-08-24')).toBe(false)
  })
})
