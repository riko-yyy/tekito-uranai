import { BottomNav, type ScreenName } from './BottomNav'
import type { HistoryEntry } from '../data/types'
import { formatJapaneseDate } from '../lib/fortune'

interface Props {
  entries: HistoryEntry[]
  categoryLabel: (entry: HistoryEntry) => string
  activeScreen: ScreenName
  onNavigate: (screen: ScreenName) => void
}

export function HistoryScreen({ entries, categoryLabel, activeScreen, onNavigate }: Props) {
  return (
    <div className="screen active">
      <p className="eyebrow">履歴</p>
      <h2>これまでの運勢</h2>
      <div className="history-list">
        {entries.map((entry, index) => (
          <div key={entry.dateKey} className={`history-row${index >= 3 ? ' faded' : ''}`}>
            <div className="history-icon">
              <i className={`ti ti-${entry.action.icon}`} />
            </div>
            <div className="history-body">
              <p className="history-date">{formatJapaneseDate(new Date(entry.dateKey))}</p>
              <p className="history-title">今日は&quot;{categoryLabel(entry)}&quot;の日</p>
            </div>
            <i className="ti ti-chevron-right" />
          </div>
        ))}
      </div>
      <BottomNav active={activeScreen} onNavigate={onNavigate} />
    </div>
  )
}
