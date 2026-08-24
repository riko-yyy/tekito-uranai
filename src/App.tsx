import { useMemo, useState } from 'react'
import './App.css'
import { useActionsData } from './hooks/useActionsData'
import { getDateKey, formatJapaneseDate, pickActionForDate } from './lib/fortune'
import type { HistoryEntry } from './data/types'
import type { ScreenName } from './components/BottomNav'
import { TodayScreen } from './components/TodayScreen'
import { HistoryScreen } from './components/HistoryScreen'
import { FavoritesScreen } from './components/FavoritesScreen'

const HISTORY_DAYS = 6

function App() {
  const { data, loading, error } = useActionsData()
  const [screen, setScreen] = useState<ScreenName>('today')

  const history = useMemo<HistoryEntry[]>(() => {
    if (!data) return []
    const entries: HistoryEntry[] = []
    for (let offset = 0; offset < HISTORY_DAYS; offset++) {
      const date = new Date()
      date.setDate(date.getDate() - offset)
      const dateKey = getDateKey(date)
      const action = pickActionForDate(data.actions, dateKey)
      entries.push({ dateKey, action, isFavorite: offset % 3 === 0 })
    }
    return entries
  }, [data])

  if (loading) {
    return (
      <div className="phone">
        <p className="empty-state">読み込み中...</p>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="phone">
        <p className="empty-state">アクションDBの読み込みに失敗しました。{error}</p>
      </div>
    )
  }

  const categoryLabel = (categoryId: string) =>
    data.categories.find((c) => c.id === categoryId)?.label ?? categoryId

  const today = history[0]

  return (
    <div className="phone">
      {screen === 'today' && today && (
        <TodayScreen
          action={today.action}
          categoryLabel={categoryLabel(today.action.category)}
          dateLabel={formatJapaneseDate(new Date(today.dateKey))}
          activeScreen={screen}
          onNavigate={setScreen}
        />
      )}
      {screen === 'history' && (
        <HistoryScreen
          entries={history}
          categoryLabel={(entry) => categoryLabel(entry.action.category)}
          activeScreen={screen}
          onNavigate={setScreen}
        />
      )}
      {screen === 'fav' && (
        <FavoritesScreen
          favorites={history.filter((entry) => entry.isFavorite)}
          activeScreen={screen}
          onNavigate={setScreen}
        />
      )}
    </div>
  )
}

export default App
