import { ReactNode, useState } from 'react'
import type { Preview } from '@storybook/react-vite'
import { Provider } from 'react-redux'
import { QueryClientProvider } from '@tanstack/react-query'
import CssBaseline from '@mui/material/CssBaseline'
import GlobalStyles from '@mui/material/GlobalStyles'
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

// the docs controls use native radios; draw the checked one as a ring with a white gap around the dot
const docsRadios = (
  <GlobalStyles
    styles={({ palette }) => ({
      '.docblock-argstable input[type="radio"]': {
        appearance: 'none',
        width: 16,
        height: 16,
        borderRadius: '50%',
        border: `2px solid ${palette.grey[500]}`,
        backgroundColor: palette.common.white,
        '&:checked': {
          borderColor: palette.primary.main,
          backgroundColor: palette.primary.main,
          boxShadow: `inset 0 0 0 2px ${palette.common.white}`,
        },
        '&:focus-visible': { outline: `2px solid ${palette.primary.main}`, outlineOffset: 2 },
      },
    })}
  />
)

const preview: Preview = {
  tags: ['autodocs'],
  loaders: [mswLoader()],
  decorators: [
    (Story) => (
      <AppProviders>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {docsRadios}
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
