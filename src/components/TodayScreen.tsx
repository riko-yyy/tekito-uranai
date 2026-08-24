import { BottomNav, type ScreenName } from './BottomNav'
import type { Action } from '../data/types'

interface Props {
  action: Action
  categoryLabel: string
  dateLabel: string
  activeScreen: ScreenName
  onNavigate: (screen: ScreenName) => void
}

function shareResult(action: Action, categoryLabel: string) {
  const text = `今日は"${categoryLabel}"の日\n${action.text}\n${action.reason}`
  if (navigator.share) {
    navigator.share({ text }).catch(() => {
      /* user cancelled share sheet */
    })
    return
  }
  navigator.clipboard?.writeText(text)
}

export function TodayScreen({ action, categoryLabel, dateLabel, activeScreen, onNavigate }: Props) {
  return (
    <div className="screen active">
      <div className="today-card">
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
        <button type="button" className="btn-primary" onClick={() => shareResult(action, categoryLabel)}>
          <i className="ti ti-share-2" style={{ marginRight: 6 }} />
          結果をシェア
        </button>
        <button type="button" className="btn-secondary" disabled title="占いは1日1回までです">
          明日また占う
        </button>
      </div>
      <BottomNav active={activeScreen} onNavigate={onNavigate} />
    </div>
  )
}
