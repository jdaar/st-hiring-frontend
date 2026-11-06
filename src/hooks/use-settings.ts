import { useMemo } from 'react'
import { queryOptions, useMutationState, useQuery } from '@tanstack/react-query'
import { GetSettingsEndpoint, Setting, isUpdateSettingRequest } from '@st-hiring/shared'
import { callEndpoint } from '../api/call-endpoint'
import { queryKeys } from '../api/query/query-keys'
import { UpsertSettingVariables } from './use-upsert-setting'

export const settingsQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.settings.list(),
    queryFn: ({ signal }) => callEndpoint(GetSettingsEndpoint, {}, { signal }),
  })

const withPendingUpsert = (settings: Setting[], { id, ...request }: UpsertSettingVariables): Setting[] => {
  const existing = settings.find((setting) => setting.id === id)
  const now = new Date()

  if (isUpdateSettingRequest(request)) {
    return existing
      ? settings.map((setting) =>
          setting === existing ? { ...existing, value: request.value, version: request.version + 1, updatedAt: now } : setting,
        )
      : settings
  }

  return existing
    ? settings
    : [...settings, { id, value: request.value, version: 1, createdAt: now, updatedAt: now }].sort((a, b) =>
        a.id.localeCompare(b.id),
      )
}

// settings with pending upserts applied optimistically; a failed upsert simply stops being pending
export const useSettings = () => {
  const query = useQuery(settingsQueryOptions())
  const pendingUpserts = useMutationState({
    filters: { mutationKey: queryKeys.settings.upsert(), status: 'pending' },
    select: (mutation) => mutation.state.variables as UpsertSettingVariables,
  })

  const data = useMemo(() => query.data && pendingUpserts.reduce(withPendingUpsert, query.data), [query.data, pendingUpserts])

  return { ...query, data }
}

export const useSetting = (id: string) => {
  const { data, ...query } = useSettings()

  return { ...query, data: data?.find((setting) => setting.id === id) }
}
