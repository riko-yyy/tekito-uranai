import { useCallback, useEffect, useState } from 'react'
import type { Action, ActionsDB, HistoryEntry, StoredHistoryEntry } from '../data/types'
import { daysBefore, excludeRecentActions, getDateKey, pickAction } from '../lib/fortune'
import { getAllHistory, saveHistoryEntry, setFavorite } from '../lib/historyStore'

const RECENT_WINDOW_DAYS = 7

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
      let stored = await getAllHistory()

      const alreadyDrawn = stored.some((entry) => entry.dateKey === todayKey)
      if (!alreadyDrawn) {
        const recentIds = stored
          .filter((entry) => daysBefore(entry.dateKey, todayKey) <= RECENT_WINDOW_DAYS)
          .map((entry) => entry.actionId)
        const pool = excludeRecentActions(actionsDB!.actions, recentIds)
        const index = Math.floor(Math.random() * pool.length)
        const action = pickAction(pool, index)

        const newEntry: StoredHistoryEntry = { dateKey: todayKey, actionId: action.id, isFavorite: false }
        await saveHistoryEntry(newEntry)
        stored = [newEntry, ...stored]
      }

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
