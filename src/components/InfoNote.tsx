import { useState } from 'react'

export const HISTORY_PERSISTENCE_NOTE =
  '履歴やお気に入りはこの端末・このブラウザの中だけに保存されます。機種変更やブラウザの変更、キャッシュ削除を行うと消えてしまうのでご注意ください。'

interface Props {
  text: string
  align?: 'left' | 'right'
}

export function InfoNote({ text, align = 'left' }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <span className="info-note">
      <button
        type="button"
        className="info-note-trigger"
        aria-label={open ? '注釈を閉じる' : '注釈を開く'}
        onClick={() => setOpen((v) => !v)}
      >
        <i className={`ti ti-${open ? 'x' : 'info-circle'}`} />
      </button>
      {open && <p className={`info-note-body info-note-body-${align}`}>{text}</p>}
    </span>
  )
}
