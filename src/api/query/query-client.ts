import { QueryClient, QueryClientConfig } from '@tanstack/react-query'
import { retryDelay, shouldRetryMutation, shouldRetryQuery } from './retry'

const STALE_TIME_MS = 30_000

export const createQueryClient = (config: Pick<QueryClientConfig, 'defaultOptions'> = {}) =>
  new QueryClient({
    defaultOptions: {
      ...config.defaultOptions,
      queries: {
        staleTime: STALE_TIME_MS,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        retry: shouldRetryQuery,
        retryDelay,
        ...config.defaultOptions?.queries,
      },
      mutations: {
        retry: shouldRetryMutation,
        retryDelay,
        ...config.defaultOptions?.mutations,
      },
    },
  })
