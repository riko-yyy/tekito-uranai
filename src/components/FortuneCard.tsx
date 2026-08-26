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
  isCompleted: boolean
  onToggleCompleted?: () => void
  children?: ReactNode
}

export function FortuneCard({
  action,
  categoryLabel,
  dateLabel,
  isFavorite,
  onToggleFavorite,
  isCompleted,
  onToggleCompleted,
  children,
}: Props) {
  return (
    <div className={`today-card${isCompleted ? ' done' : ''}`}>
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
        {isCompleted && (
          <div className="check-badge">
            <i className="ti ti-check" />
          </div>
        )}
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
      {onToggleCompleted && (
        <button
          type="button"
          className={`complete-row${isCompleted ? ' done' : ''}`}
          onClick={onToggleCompleted}
        >
          <span className="check-circle">
            <i className="ti ti-check" />
          </span>
          <span className="label">{isCompleted ? 'やった！' : 'これ、やった'}</span>
        </button>
      )}
      {isCompleted ? (
        <button
          type="button"
          className="btn-gold"
          onClick={() => shareResult(action, categoryLabel, dateLabel, isCompleted)}
        >
          <i className="ti ti-share-2" style={{ marginRight: 6 }} />
          達成をシェア
        </button>
      ) : (
        <button
          type="button"
          className="btn-primary"
          onClick={() => shareResult(action, categoryLabel, dateLabel, isCompleted)}
        >
          <i className="ti ti-share-2" style={{ marginRight: 6 }} />
          結果をシェア
        </button>
      )}
      {children}
    </div>
  )
}
