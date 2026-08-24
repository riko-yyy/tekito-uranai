import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  IDBCursor,
  IDBCursorWithValue,
  IDBDatabase,
  IDBFactory,
  IDBIndex,
  IDBKeyRange,
  IDBObjectStore,
  IDBOpenDBRequest,
  IDBRequest,
  IDBTransaction,
  IDBVersionChangeEvent,
} from 'fake-indexeddb'

Object.assign(globalThis, {
  IDBCursor,
  IDBCursorWithValue,
  IDBDatabase,
  IDBFactory,
  IDBIndex,
  IDBKeyRange,
  IDBObjectStore,
  IDBOpenDBRequest,
  IDBRequest,
  IDBTransaction,
  IDBVersionChangeEvent,
})

async function freshStore() {
  vi.resetModules()
  globalThis.indexedDB = new IDBFactory()
  return import('./historyStore')
}

describe('historyStore', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('returns undefined for an entry that has not been saved', async () => {
    const store = await freshStore()
    expect(await store.getHistoryEntry('2026-08-24')).toBeUndefined()
  })

  it('saves and retrieves an entry by dateKey', async () => {
    const store = await freshStore()
    await store.saveHistoryEntry({ dateKey: '2026-08-24', actionId: 'action_001', isFavorite: false })
    expect(await store.getHistoryEntry('2026-08-24')).toEqual({
      dateKey: '2026-08-24',
      actionId: 'action_001',
      isFavorite: false,
    })
  })

  it('lists all entries sorted by dateKey descending', async () => {
    const store = await freshStore()
    await store.saveHistoryEntry({ dateKey: '2026-08-22', actionId: 'a', isFavorite: false })
    await store.saveHistoryEntry({ dateKey: '2026-08-24', actionId: 'b', isFavorite: false })
    await store.saveHistoryEntry({ dateKey: '2026-08-23', actionId: 'c', isFavorite: false })

    const all = await store.getAllHistory()

    expect(all.map((e) => e.dateKey)).toEqual(['2026-08-24', '2026-08-23', '2026-08-22'])
  })

  it('toggles the favorite flag for an existing entry', async () => {
    const store = await freshStore()
    await store.saveHistoryEntry({ dateKey: '2026-08-24', actionId: 'a', isFavorite: false })

    await store.setFavorite('2026-08-24', true)

    expect((await store.getHistoryEntry('2026-08-24'))?.isFavorite).toBe(true)
  })

  it('does nothing when toggling favorite for a missing entry', async () => {
    const store = await freshStore()

    await expect(store.setFavorite('2026-08-24', true)).resolves.toBeUndefined()

    expect(await store.getHistoryEntry('2026-08-24')).toBeUndefined()
  })
})
