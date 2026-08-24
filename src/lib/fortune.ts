import type { Action } from '../data/types'

const WEEKDAY_LABELS_JP = ['日', '月', '火', '水', '木', '金', '土']

export function getDateKey(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function formatJapaneseDate(date: Date): string {
  const weekday = WEEKDAY_LABELS_JP[date.getDay()]
  return `${date.getMonth() + 1}月${date.getDate()}日(${weekday})`
}

function hashString(value: string): number {
  let hash = 0
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0
  }
  return Math.abs(hash)
}

/** Deterministically picks one action for a given date key — same date always yields the same action. */
export function pickActionForDate(actions: Action[], dateKey: string): Action {
  if (actions.length === 0) {
    throw new Error('actions must not be empty')
  }
  const index = hashString(dateKey) % actions.length
  return actions[index]
}

/** True when the fortune for `dateKey` has already been drawn (i.e. it matches the last drawn date). */
export function hasDrawnToday(lastDrawnDateKey: string | null, dateKey: string): boolean {
  return lastDrawnDateKey === dateKey
}
