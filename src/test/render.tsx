import { ReactNode } from 'react'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook } from '@testing-library/react'
import { createQueryClient } from '../api/query/query-client'
import { RootState, createStore } from '../store'

// app defaults, without waiting between retries
export const createTestQueryClient = () =>
  createQueryClient({
    defaultOptions: {
      queries: { retryDelay: 0, gcTime: Infinity },
      mutations: { retryDelay: 0 },
    },
  })

export const renderHookWithProviders = <T,>(
  hook: () => T,
  {
    preloadedState,
    queryClient = createTestQueryClient(),
  }: { preloadedState?: Partial<RootState>; queryClient?: QueryClient } = {},
) => {
  const store = createStore(preloadedState)
  const wrapper = ({ children }: { children: ReactNode }) => (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </Provider>
  )

  return { ...renderHook(hook, { wrapper }), store, queryClient }
}
