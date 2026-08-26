import { BottomNav, type ScreenName } from './BottomNav'
import { StarIcon } from './StarIcon'
import { InfoNote, HISTORY_PERSISTENCE_NOTE } from './InfoNote'
import type { HistoryEntry } from '../data/types'
import { formatJapaneseDate, parseDateKey } from '../lib/fortune'

interface Props {
  favorites: HistoryEntry[]
  onToggleFavorite: (dateKey: string) => void
  activeScreen: ScreenName
  onNavigate: (screen: ScreenName) => void
}

export function FavoritesScreen({ favorites, onToggleFavorite, activeScreen, onNavigate }: Props) {
  return (
    <div className="screen active">
      <p className="eyebrow">マイページ</p>
      <h2>お気に入り</h2>

      <div className="sub-panel active">
        <div className="fav-list-header">
          <InfoNote text={HISTORY_PERSISTENCE_NOTE} align="right" />
        </div>
        {favorites.map((entry) => (
          <div key={entry.dateKey} className="fav-row">
            <div className="history-icon">
              <i className={`ti ti-${entry.action.icon}`} />
            </div>
            <div className="history-body">
              <p className="history-date">{formatJapaneseDate(parseDateKey(entry.dateKey))}</p>
              <p className="history-title">{entry.action.text}</p>
            </div>
            <button
              type="button"
              className="fav-star-toggle"
              aria-label="お気に入りから外す"
              onClick={() => onToggleFavorite(entry.dateKey)}
            >
              <StarIcon filled />
            </button>
          </div>
        ))}
        {favorites.length === 0 && (
          <p className="empty-state">
            結果画面の★をタップすると
            <br />
            ここに保存されます
          </p>
        )}
      </div>

      <BottomNav active={activeScreen} onNavigate={onNavigate} />
    </div>
  )
}
