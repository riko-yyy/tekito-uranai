export type CategoryId = 'life' | 'social' | 'work' | 'money' | 'health' | 'mood'

export interface Category {
  id: CategoryId
  label: string
}

export interface Action {
  id: string
  category: CategoryId
  text: string
  reason: string
  actionRating: number
  luckyColor: string
  icon: string
}

export interface ActionsDB {
  categories: Category[]
  actions: Action[]
}

export interface HistoryEntry {
  dateKey: string
  action: Action
  isFavorite: boolean
}

/** Persisted shape in IndexedDB — references an action by id rather than embedding it, so storage stays small and in sync with the actions DB. */
export interface StoredHistoryEntry {
  dateKey: string
  actionId: string
  isFavorite: boolean
}
