import { useMutation, useQueryClient } from '@tanstack/react-query'
import { SettingParams, UpsertSettingEndpoint, UpsertSettingRequest } from '@st-hiring/shared'
import { callEndpoint } from '../api/call-endpoint'
import { queryKeys } from '../api/query/query-keys'

export type UpsertSettingVariables = SettingParams & UpsertSettingRequest

export const useUpsertSetting = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: queryKeys.settings.upsert(),
    mutationFn: ({ id, ...body }: UpsertSettingVariables) =>
      callEndpoint(UpsertSettingEndpoint, { params: { id }, body }),
    onSettled: () => queryClient.invalidateQueries({ queryKey: queryKeys.settings.all }),
  })
}
