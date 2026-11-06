import { hashKey, Query, QueryClient } from '@tanstack/react-query'
import { Setting, SettingValue } from '@st-hiring/shared'
import { queryKeys } from '../api/query/query-keys'
import { settingsReceived, SettingsState } from './settings.slice'
import type { AppStore } from '.'

const STORAGE_KEY = 'st-hiring:settings'
const SETTINGS_QUERY_HASH = hashKey(queryKeys.settings.list())

const isSettingsQuery = (query: Query) => query.queryHash === SETTINGS_QUERY_HASH

const dispatchLoaded = (store: AppStore, query: Query | undefined) => {
  if (query?.state.status === 'success') store.dispatch(settingsReceived(query.state.data as Setting[]))
}

// mirrors every successful settings fetch into redux; returns the unsubscribe
export const syncSettings = (queryClient: QueryClient, store: AppStore) => {
  const cache = queryClient.getQueryCache()
  dispatchLoaded(store, cache.find({ queryKey: queryKeys.settings.list(), exact: true }))

  return cache.subscribe((event) => {
    if (event.type === 'updated' && event.action.type === 'success' && isSettingsQuery(event.query)) {
      dispatchLoaded(store, event.query)
    }
  })
}

const isSettingValue = (value: unknown): value is SettingValue => ['string', 'number', 'boolean'].includes(typeof value)

// storage may be missing, blocked or hold anything, all of which start empty
export const loadPersistedSettings = (storage: Storage | undefined): SettingsState | undefined => {
  try {
    const parsed: unknown = JSON.parse(storage?.getItem(STORAGE_KEY) ?? 'null')
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return undefined
    const values = Object.entries(parsed).filter((entry): entry is [string, SettingValue] => isSettingValue(entry[1]))
    return { values: Object.fromEntries(values) }
  } catch {
    return undefined
  }
}

// writes the settings values whenever they change; returns the unsubscribe
export const persistSettings = (store: AppStore, storage: Storage) => {
  let saved = store.getState().settings

  return store.subscribe(() => {
    const { settings } = store.getState()
    if (settings === saved) return
    saved = settings
    try {
      storage.setItem(STORAGE_KEY, JSON.stringify(settings.values))
    } catch {
      // full or blocked storage only loses the offline copy
    }
  })
}
