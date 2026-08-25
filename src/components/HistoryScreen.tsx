import { BottomNav, type ScreenName } from './BottomNav'
import { InfoNote, HISTORY_PERSISTENCE_NOTE } from './InfoNote'
import type { HistoryEntry } from '../data/types'
import { formatJapaneseDate, parseDateKey } from '../lib/fortune'

interface Props {
  entries: HistoryEntry[]
  categoryLabel: (entry: HistoryEntry) => string
  onSelect: (dateKey: string) => void
  activeScreen: ScreenName
  onNavigate: (screen: ScreenName) => void
}

export function HistoryScreen({ entries, categoryLabel, onSelect, activeScreen, onNavigate }: Props) {
  return (
    <div className="screen active">
      <p className="eyebrow">履歴</p>
      <h2>
        これまでの運勢
        <InfoNote text={HISTORY_PERSISTENCE_NOTE} />
      </h2>
      <div className="history-list">
        {entries.map((entry, index) => (
          <button
            key={entry.dateKey}
            type="button"
            className={`history-row${index >= 3 ? ' faded' : ''}`}
            onClick={() => onSelect(entry.dateKey)}
          >
            <div className="history-icon">
              <i className={`ti ti-${entry.action.icon}`} />
            </div>
            <div className="history-body">
              <p className="history-date">{formatJapaneseDate(parseDateKey(entry.dateKey))}</p>
              <p className="history-title">今日は&quot;{categoryLabel(entry)}&quot;の日</p>
            </div>
            <i className="ti ti-chevron-right" />
          </button>
        ))}
      </div>
      <BottomNav active={activeScreen} onNavigate={onNavigate} />
    </div>
  )
}
