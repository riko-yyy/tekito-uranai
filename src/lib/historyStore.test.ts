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
    await store.saveHistoryEntry({
      dateKey: '2026-08-24',
      actionId: 'action_001',
      isFavorite: false,
      isCompleted: false,
      completedAt: null,
    })
    expect(await store.getHistoryEntry('2026-08-24')).toEqual({
      dateKey: '2026-08-24',
      actionId: 'action_001',
      isFavorite: false,
      isCompleted: false,
      completedAt: null,
    })
  })

  it('lists all entries sorted by dateKey descending', async () => {
    const store = await freshStore()
    await store.saveHistoryEntry({
      dateKey: '2026-08-22',
      actionId: 'a',
      isFavorite: false,
      isCompleted: false,
      completedAt: null,
    })
    await store.saveHistoryEntry({
      dateKey: '2026-08-24',
      actionId: 'b',
      isFavorite: false,
      isCompleted: false,
      completedAt: null,
    })
    await store.saveHistoryEntry({
      dateKey: '2026-08-23',
      actionId: 'c',
      isFavorite: false,
      isCompleted: false,
      completedAt: null,
    })

    const all = await store.getAllHistory()

    expect(all.map((e) => e.dateKey)).toEqual(['2026-08-24', '2026-08-23', '2026-08-22'])
  })

  it('toggles the favorite flag for an existing entry', async () => {
    const store = await freshStore()
    await store.saveHistoryEntry({
      dateKey: '2026-08-24',
      actionId: 'a',
      isFavorite: false,
      isCompleted: false,
      completedAt: null,
    })

    await store.setFavorite('2026-08-24', true)

    expect((await store.getHistoryEntry('2026-08-24'))?.isFavorite).toBe(true)
  })

  it('does nothing when toggling favorite for a missing entry', async () => {
    const store = await freshStore()

    await expect(store.setFavorite('2026-08-24', true)).resolves.toBeUndefined()

    expect(await store.getHistoryEntry('2026-08-24')).toBeUndefined()
  })

  it('sets completedAt when marking an entry completed, and clears it when un-marking', async () => {
    const store = await freshStore()
    await store.saveHistoryEntry({
      dateKey: '2026-08-24',
      actionId: 'a',
      isFavorite: false,
      isCompleted: false,
      completedAt: null,
    })

    await store.setCompleted('2026-08-24', true)
    const completed = await store.getHistoryEntry('2026-08-24')
    expect(completed?.isCompleted).toBe(true)
    expect(typeof completed?.completedAt).toBe('string')

    await store.setCompleted('2026-08-24', false)
    const uncompleted = await store.getHistoryEntry('2026-08-24')
    expect(uncompleted?.isCompleted).toBe(false)
    expect(uncompleted?.completedAt).toBeNull()
  })

  it('does nothing when marking a missing entry completed', async () => {
    const store = await freshStore()

    await expect(store.setCompleted('2026-08-24', true)).resolves.toBeUndefined()

    expect(await store.getHistoryEntry('2026-08-24')).toBeUndefined()
  })

  it('defaults isCompleted/completedAt for legacy records saved without them', async () => {
    const store = await freshStore()
    // Simulate a record saved before isCompleted/completedAt existed, bypassing the
    // typed saveHistoryEntry so the object genuinely lacks the fields at runtime.
    const legacy = { dateKey: '2026-08-24', actionId: 'a', isFavorite: false } as unknown as Parameters<
      typeof store.saveHistoryEntry
    >[0]
    await store.saveHistoryEntry(legacy)

    const entry = await store.getHistoryEntry('2026-08-24')
    expect(entry?.isCompleted).toBe(false)
    expect(entry?.completedAt).toBeNull()

    const all = await store.getAllHistory()
    expect(all[0].isCompleted).toBe(false)
    expect(all[0].completedAt).toBeNull()
  })
})
