import { ReactNode, useState } from 'react'
import type { Preview } from '@storybook/react-vite'
import { Provider } from 'react-redux'
import { QueryClientProvider } from '@tanstack/react-query'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { mswLoader } from 'msw-storybook-addon/csf3'
import { createQueryClient } from '../src/api/query/query-client'
import { createStore } from '../src/store'
import { syncSettings } from '../src/store/settings-sync'
import { theme } from '../src/theme'

// fresh cache and store per story, short retries so failure stories settle quickly
const AppProviders = ({ children }: { children: ReactNode }) => {
  const [{ store, queryClient }] = useState(() => {
    const store = createStore()
    const queryClient = createQueryClient({
      defaultOptions: { queries: { retryDelay: 300 }, mutations: { retryDelay: 300 } },
    })
    syncSettings(queryClient, store)
    return { store, queryClient }
  })

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </Provider>
  )
}

const preview: Preview = {
  tags: ['autodocs'],
  loaders: [mswLoader()],
  decorators: [
    (Story) => (
      <AppProviders>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Story />
        </ThemeProvider>
      </AppProviders>
    ),
  ],
  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
  },
}

export default preview
