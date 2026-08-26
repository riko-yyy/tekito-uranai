import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import type { StoredHistoryEntry } from '../data/types'

interface HistoryDB extends DBSchema {
  history: {
    key: string
    value: StoredHistoryEntry
  }
}

const DB_NAME = 'tekito-uranai'
const DB_VERSION = 1
const STORE_NAME = 'history'

let dbPromise: Promise<IDBPDatabase<HistoryDB>> | null = null

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<HistoryDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        db.createObjectStore(STORE_NAME, { keyPath: 'dateKey' })
      },
    })
  }
  return dbPromise
}

/** Fills in fields that older saved records may not have (e.g. isCompleted/completedAt added later). */
function normalize(entry: StoredHistoryEntry): StoredHistoryEntry {
  return {
    ...entry,
    isCompleted: entry.isCompleted ?? false,
    completedAt: entry.completedAt ?? null,
  }
}

export async function getAllHistory(): Promise<StoredHistoryEntry[]> {
  const db = await getDB()
  const all = await db.getAll(STORE_NAME)
  return all.map(normalize).sort((a, b) => (a.dateKey < b.dateKey ? 1 : -1))
}

export async function getHistoryEntry(dateKey: string): Promise<StoredHistoryEntry | undefined> {
  const db = await getDB()
  const entry = await db.get(STORE_NAME, dateKey)
  return entry ? normalize(entry) : undefined
}

export async function saveHistoryEntry(entry: StoredHistoryEntry): Promise<void> {
  const db = await getDB()
  await db.put(STORE_NAME, entry)
}

export async function setFavorite(dateKey: string, isFavorite: boolean): Promise<void> {
  const db = await getDB()
  const entry = await db.get(STORE_NAME, dateKey)
  if (!entry) return
  await db.put(STORE_NAME, { ...entry, isFavorite })
}

export async function setCompleted(dateKey: string, isCompleted: boolean): Promise<void> {
  const db = await getDB()
  const entry = await db.get(STORE_NAME, dateKey)
  if (!entry) return
  await db.put(STORE_NAME, {
    ...entry,
    isCompleted,
    completedAt: isCompleted ? new Date().toISOString() : null,
  })
}
