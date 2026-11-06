import { ReactElement, ReactNode } from 'react'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from '@mui/material/styles'
import { render, renderHook } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createQueryClient } from '../api/query/query-client'
import { RootState, createStore } from '../store'
import { theme } from '../theme'

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

// query through screen
export const renderWithTheme = (ui: ReactElement) => {
  const user = userEvent.setup()
  const { rerender } = render(ui, { wrapper: ({ children }) => <ThemeProvider theme={theme}>{children}</ThemeProvider> })

  return { user, rerender }
}
