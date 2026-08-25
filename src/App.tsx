import { useState } from 'react'
import './App.css'
import { useActionsData } from './hooks/useActionsData'
import { useHistory } from './hooks/useHistory'
import { formatJapaneseDate, getDateKey, parseDateKey } from './lib/fortune'
import type { ScreenName } from './components/BottomNav'
import { TodayScreen } from './components/TodayScreen'
import { HistoryScreen } from './components/HistoryScreen'
import { HistoryDetailScreen } from './components/HistoryDetailScreen'
import { FavoritesScreen } from './components/FavoritesScreen'

function App() {
  const { data, loading: actionsLoading, error } = useActionsData()
  const { entries, loading: historyLoading, toggleFavorite } = useHistory(data)
  const [screen, setScreen] = useState<ScreenName>('today')
  const [historyDetailKey, setHistoryDetailKey] = useState<string | null>(null)

  const navigate = (next: ScreenName) => {
    setHistoryDetailKey(null)
    setScreen(next)
  }

  if (actionsLoading || historyLoading) {
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

  const todayKey = getDateKey(new Date())
  const today = entries.find((entry) => entry.dateKey === todayKey)
  const historyDetailEntry = historyDetailKey ? entries.find((e) => e.dateKey === historyDetailKey) : undefined

  return (
    <div className="phone">
      {screen === 'today' && today && (
        <TodayScreen
          action={today.action}
          categoryLabel={categoryLabel(today.action.category)}
          dateLabel={formatJapaneseDate(parseDateKey(today.dateKey))}
          isFavorite={today.isFavorite}
          onToggleFavorite={() => toggleFavorite(today.dateKey)}
          activeScreen={screen}
          onNavigate={navigate}
        />
      )}
      {screen === 'history' && historyDetailEntry && (
        <HistoryDetailScreen
          entry={historyDetailEntry}
          categoryLabel={categoryLabel(historyDetailEntry.action.category)}
          onToggleFavorite={() => toggleFavorite(historyDetailEntry.dateKey)}
          onBack={() => setHistoryDetailKey(null)}
        />
      )}
      {screen === 'history' && !historyDetailEntry && (
        <HistoryScreen
          entries={entries}
          categoryLabel={(entry) => categoryLabel(entry.action.category)}
          onSelect={setHistoryDetailKey}
          activeScreen={screen}
          onNavigate={navigate}
        />
      )}
      {screen === 'fav' && (
        <FavoritesScreen
          favorites={entries.filter((entry) => entry.isFavorite)}
          onToggleFavorite={toggleFavorite}
          activeScreen={screen}
          onNavigate={navigate}
        />
      )}
    </div>
  )
}

export default App
