export type ScreenName = 'today' | 'history' | 'fav'

interface Props {
  active: ScreenName
  onNavigate: (screen: ScreenName) => void
}

const ITEMS: { name: ScreenName; icon: string }[] = [
  { name: 'today', icon: 'ti-home' },
  { name: 'history', icon: 'ti-history' },
  { name: 'fav', icon: 'ti-star' },
]

export function BottomNav({ active, onNavigate }: Props) {
  return (
    <div className="bottom-nav">
      {ITEMS.map((item) => (
        <button
          key={item.name}
          type="button"
          className={`nav-item${item.name === active ? ' active' : ''}`}
          onClick={() => onNavigate(item.name)}
        >
          <i className={`ti ${item.icon}`} />
        </button>
      ))}
    </div>
  )
}
