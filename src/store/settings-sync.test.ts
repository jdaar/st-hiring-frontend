import { describe, expect, it, vi } from 'vitest'
import { makeSetting } from '../test/fixtures'
import { createTestQueryClient } from '../test/render'
import { queryKeys } from '../api/query/query-keys'
import { createStore } from '.'
import { loadPersistedSettings, persistSettings, syncSettings } from './settings-sync'

const createStorage = (initial: Record<string, string> = {}): Storage => {
  const items = new Map(Object.entries(initial))
  return {
    get length() {
      return items.size
    },
    clear: () => items.clear(),
    getItem: (key) => items.get(key) ?? null,
    key: (index) => [...items.keys()][index] ?? null,
    removeItem: (key) => void items.delete(key),
    setItem: (key, value) => void items.set(key, value),
  }
}

describe('syncSettings', () => {
  it('copies every successful settings fetch into the store', () => {
    const queryClient = createTestQueryClient()
    const store = createStore()
    syncSettings(queryClient, store)

    queryClient.setQueryData(queryKeys.settings.list(), [makeSetting('maxTicketsPerOrder', { value: 6 })])
    expect(store.getState().settings.values).toEqual({ maxTicketsPerOrder: 6 })

    queryClient.setQueryData(queryKeys.settings.list(), [makeSetting('maxTicketsPerOrder', { value: 9 })])
    expect(store.getState().settings.values).toEqual({ maxTicketsPerOrder: 9 })
  })

  it('picks up settings already in the cache', () => {
    const queryClient = createTestQueryClient()
    queryClient.setQueryData(queryKeys.settings.list(), [makeSetting('salesOpen', { value: true })])
    const store = createStore()

    syncSettings(queryClient, store)

    expect(store.getState().settings.values).toEqual({ salesOpen: true })
  })

  it('ignores other queries and stops when unsubscribed', () => {
    const queryClient = createTestQueryClient()
    const store = createStore()
    const unsubscribe = syncSettings(queryClient, store)

    queryClient.setQueryData(['events'], [makeSetting('maxTicketsPerOrder')])
    expect(store.getState().settings.values).toEqual({})

    unsubscribe()
    queryClient.setQueryData(queryKeys.settings.list(), [makeSetting('maxTicketsPerOrder', { value: 6 })])
    expect(store.getState().settings.values).toEqual({})
  })
})

describe('settings persistence', () => {
  it('saves the values when they change and loads them back', () => {
    const storage = createStorage()
    const store = createStore()
    persistSettings(store, storage)

    store.dispatch({ type: 'eventsPagination/nextPage' })
    expect(storage.getItem('st-hiring:settings')).toBeNull()

    store.dispatch({ type: 'settings/settingsReceived', payload: [makeSetting('maxTicketsPerOrder', { value: 6 })] })
    expect(loadPersistedSettings(storage)).toEqual({ values: { maxTicketsPerOrder: 6 } })
  })

  it('drops stored values that are not setting values', () => {
    const storage = createStorage({ 'st-hiring:settings': JSON.stringify({ maxTicketsPerOrder: 6, nested: { a: 1 } }) })

    expect(loadPersistedSettings(storage)).toEqual({ values: { maxTicketsPerOrder: 6 } })
  })

  it.each([
    ['missing storage', undefined],
    ['nothing stored', createStorage()],
    ['invalid json', createStorage({ 'st-hiring:settings': '{oops' })],
    ['an array', createStorage({ 'st-hiring:settings': '[1]' })],
  ])('starts empty with %s', (_, storage) => {
    expect(loadPersistedSettings(storage)).toBeUndefined()
  })

  it('survives storage that refuses writes', () => {
    const storage = createStorage()
    storage.setItem = vi.fn(() => {
      throw new Error('QuotaExceededError')
    })
    const store = createStore()
    persistSettings(store, storage)

    expect(() =>
      store.dispatch({ type: 'settings/settingsReceived', payload: [makeSetting('maxTicketsPerOrder', { value: 6 })] }),
    ).not.toThrow()
  })
})
