import { useState } from 'react'
import { BottomNav, type ScreenName } from './BottomNav'
import { StarIcon } from './StarIcon'
import { InfoNote, HISTORY_PERSISTENCE_NOTE } from './InfoNote'
import type { HistoryEntry } from '../data/types'
import { formatJapaneseDate, parseDateKey } from '../lib/fortune'

type Tab = 'favlist' | 'premium'

interface Props {
  favorites: HistoryEntry[]
  onToggleFavorite: (dateKey: string) => void
  activeScreen: ScreenName
  onNavigate: (screen: ScreenName) => void
}

export function FavoritesScreen({ favorites, onToggleFavorite, activeScreen, onNavigate }: Props) {
  const [tab, setTab] = useState<Tab>('favlist')

  return (
    <div className="screen active">
      <p className="eyebrow">マイページ</p>
      <h2>お気に入り・プレミアム</h2>

      <div className="segmented">
        <button type="button" className={tab === 'favlist' ? 'active' : ''} onClick={() => setTab('favlist')}>
          お気に入り
        </button>
        <button type="button" className={tab === 'premium' ? 'active' : ''} onClick={() => setTab('premium')}>
          プレミアム
        </button>
      </div>

      {tab === 'favlist' && (
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
      )}

      {tab === 'premium' && (
        <div className="sub-panel active">
          <div className="premium-card">
            <span className="badge">
              <i className="ti ti-sparkles" style={{ fontSize: 12 }} />
              プレミアム
            </span>
            <h3>プレミアムアクション集</h3>
            <p className="desc">季節限定・恋愛特化など、いつもより濃いアクションパターンが解放されます。</p>
            <ul className="premium-list">
              <li>
                <i className="ti ti-check" />
                季節限定アクション(毎月更新)
              </li>
              <li>
                <i className="ti ti-check" />
                恋愛運・相性に特化したアクション
              </li>
              <li>
                <i className="ti ti-check" />
                広告非表示
              </li>
            </ul>
            <button type="button" className="btn-gold">
              月額プランを見る
            </button>
          </div>
        </div>
      )}

      <BottomNav active={activeScreen} onNavigate={onNavigate} />
    </div>
  )
}
