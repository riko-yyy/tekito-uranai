import { BottomNav, type ScreenName } from './BottomNav'
import { FortuneCard } from './FortuneCard'
import type { Action } from '../data/types'

interface Props {
  action: Action
  categoryLabel: string
  dateLabel: string
  isFavorite: boolean
  onToggleFavorite: () => void
  activeScreen: ScreenName
  onNavigate: (screen: ScreenName) => void
}

export function TodayScreen({
  action,
  categoryLabel,
  dateLabel,
  isFavorite,
  onToggleFavorite,
  activeScreen,
  onNavigate,
}: Props) {
  return (
    <div className="screen active">
      <FortuneCard
        action={action}
        categoryLabel={categoryLabel}
        dateLabel={dateLabel}
        isFavorite={isFavorite}
        onToggleFavorite={onToggleFavorite}
      >
        <button type="button" className="btn-secondary" disabled title="占いは1日1回までです">
          明日また占う
        </button>
      </FortuneCard>
      <BottomNav active={activeScreen} onNavigate={onNavigate} />
    </div>
  )
}
