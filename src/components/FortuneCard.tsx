import type { ReactNode } from 'react'
import { StarIcon } from './StarIcon'
import type { Action } from '../data/types'
import { shareResult } from '../lib/share'

interface Props {
  action: Action
  categoryLabel: string
  dateLabel: string
  isFavorite: boolean
  onToggleFavorite: () => void
  children?: ReactNode
}

export function FortuneCard({ action, categoryLabel, dateLabel, isFavorite, onToggleFavorite, children }: Props) {
  return (
    <div className="today-card">
      <button
        type="button"
        className={`today-star-toggle${isFavorite ? ' active' : ''}`}
        aria-label="お気に入りに登録"
        onClick={onToggleFavorite}
      >
        <StarIcon filled={isFavorite} />
      </button>
      <p className="eyebrow">{dateLabel}の運勢</p>
      <h2>今日は&quot;{categoryLabel}&quot;の日</h2>
      <div className="today-icon">
        <i className={`ti ti-${action.icon}`} />
      </div>
      <p className="today-desc">
        {action.text}
        <br />
        {action.reason}
      </p>
      <div className="tag-row">
        <span className="tag">行動運 {'★'.repeat(action.actionRating)}{'☆'.repeat(5 - action.actionRating)}</span>
        <span className="tag">ラッキーカラー {action.luckyColor}</span>
      </div>
      <button type="button" className="btn-primary" onClick={() => shareResult(action, categoryLabel, dateLabel)}>
        <i className="ti ti-share-2" style={{ marginRight: 6 }} />
        結果をシェア
      </button>
      {children}
    </div>
  )
}
