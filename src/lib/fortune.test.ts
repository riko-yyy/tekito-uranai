import { describe, expect, it } from 'vitest'
import { daysBefore, excludeRecentActions, formatJapaneseDate, getDateKey, parseDateKey, pickAction } from './fortune'
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

describe('pickAction', () => {
  const actions = [makeAction('a'), makeAction('b'), makeAction('c'), makeAction('d')]

  it('returns the action at the given index', () => {
    expect(pickAction(actions, 0).id).toBe('a')
    expect(pickAction(actions, 2).id).toBe('c')
  })

  it('wraps out-of-range indexes via modulo', () => {
    expect(pickAction(actions, 4).id).toBe('a')
    expect(pickAction(actions, 5).id).toBe('b')
  })

  it('throws when there are no actions to pick from', () => {
    expect(() => pickAction([], 0)).toThrow()
  })
})

describe('excludeRecentActions', () => {
  const actions = [makeAction('a'), makeAction('b'), makeAction('c')]

  it('filters out actions whose id is excluded', () => {
    const result = excludeRecentActions(actions, ['a'])
    expect(result.map((a) => a.id)).toEqual(['b', 'c'])
  })

  it('falls back to the full list when everything would be excluded', () => {
    const result = excludeRecentActions(actions, ['a', 'b', 'c'])
    expect(result).toEqual(actions)
  })

  it('returns everything unchanged when nothing is excluded', () => {
    expect(excludeRecentActions(actions, [])).toEqual(actions)
  })
})

describe('daysBefore', () => {
  it('is 0 for the same date', () => {
    expect(daysBefore('2026-08-24', '2026-08-24')).toBe(0)
  })

  it('is positive when dateKey is before referenceDateKey', () => {
    expect(daysBefore('2026-08-17', '2026-08-24')).toBe(7)
  })

  it('is negative when dateKey is after referenceDateKey', () => {
    expect(daysBefore('2026-08-25', '2026-08-24')).toBe(-1)
  })
})
