import type { Action } from '../data/types'

const WEEKDAY_LABELS_JP = ['日', '月', '火', '水', '木', '金', '土']

export function getDateKey(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/** Parses a `getDateKey` string back into a local-midnight Date (avoids the UTC-shift `new Date(dateKey)` has). */
export function parseDateKey(dateKey: string): Date {
  const [y, m, d] = dateKey.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function formatJapaneseDate(date: Date): string {
  const weekday = WEEKDAY_LABELS_JP[date.getDay()]
  return `${date.getMonth() + 1}月${date.getDate()}日(${weekday})`
}

/** Picks the action at `index` — the randomness itself lives outside this function, at the caller. */
export function pickAction(actions: Action[], index: number): Action {
  if (actions.length === 0) {
    throw new Error('actions must not be empty')
  }
  return actions[index % actions.length]
}

/** Filters out actions whose id is in `excludedIds`, unless that would leave nothing to pick from. */
export function excludeRecentActions(actions: Action[], excludedIds: readonly string[]): Action[] {
  const excluded = new Set(excludedIds)
  const remaining = actions.filter((a) => !excluded.has(a.id))
  return remaining.length > 0 ? remaining : actions
}

/** Whole days between two dateKeys — positive when `dateKey` is before `referenceDateKey`. */
export function daysBefore(dateKey: string, referenceDateKey: string): number {
  const ms = parseDateKey(referenceDateKey).getTime() - parseDateKey(dateKey).getTime()
  return Math.round(ms / 86_400_000)
}
