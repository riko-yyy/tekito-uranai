import { useCallback, useEffect, useState } from 'react'
import type { Action, ActionsDB, HistoryEntry, StoredHistoryEntry } from '../data/types'
import { getDateKey, pickActionForDate } from '../lib/fortune'
import { getAllHistory, getHistoryEntry, saveHistoryEntry, setFavorite } from '../lib/historyStore'

function resolveEntry(stored: StoredHistoryEntry, actions: Action[]): HistoryEntry | null {
  const action = actions.find((a) => a.id === stored.actionId)
  if (!action) return null
  return { dateKey: stored.dateKey, action, isFavorite: stored.isFavorite }
}

export function useHistory(actionsDB: ActionsDB | null) {
  const [entries, setEntries] = useState<HistoryEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!actionsDB) return
    let cancelled = false

    async function load() {
      const todayKey = getDateKey(new Date())
      const existing = await getHistoryEntry(todayKey)
      if (!existing) {
        const action = pickActionForDate(actionsDB!.actions, todayKey)
        await saveHistoryEntry({ dateKey: todayKey, actionId: action.id, isFavorite: false })
      }

      const stored = await getAllHistory()
      if (cancelled) return

      const resolved = stored
        .map((entry) => resolveEntry(entry, actionsDB!.actions))
        .filter((entry): entry is HistoryEntry => entry !== null)
      setEntries(resolved)
      setLoading(false)
    }

    load()
    return () => {
      cancelled = true
    }
  }, [actionsDB])

  const toggleFavorite = useCallback(async (dateKey: string) => {
    setEntries((prev) => {
      const target = prev.find((e) => e.dateKey === dateKey)
      if (target) void setFavorite(dateKey, !target.isFavorite)
      return prev.map((e) => (e.dateKey === dateKey ? { ...e, isFavorite: !e.isFavorite } : e))
    })
  }, [])

  return { entries, loading, toggleFavorite }
}
