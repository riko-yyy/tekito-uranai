import { FortuneCard } from './FortuneCard'
import type { HistoryEntry } from '../data/types'
import { formatJapaneseDate, parseDateKey } from '../lib/fortune'

interface Props {
  entry: HistoryEntry
  categoryLabel: string
  onToggleFavorite: () => void
  onBack: () => void
}

export function HistoryDetailScreen({ entry, categoryLabel, onToggleFavorite, onBack }: Props) {
  return (
    <div className="screen active">
      <button type="button" className="detail-back" onClick={onBack}>
        <i className="ti ti-chevron-left" />
        履歴
      </button>
      <FortuneCard
        action={entry.action}
        categoryLabel={categoryLabel}
        dateLabel={formatJapaneseDate(parseDateKey(entry.dateKey))}
        isFavorite={entry.isFavorite}
        onToggleFavorite={onToggleFavorite}
      />
    </div>
  )
}
