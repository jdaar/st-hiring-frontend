import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import '@fontsource/be-vietnam-pro/400.css'
import '@fontsource/be-vietnam-pro/500.css'
import '@fontsource/be-vietnam-pro/600.css'
import '@fontsource/be-vietnam-pro/700.css'
import App from './App.tsx'
import { createQueryClient } from './api/query/query-client'
import { createStore } from './store'
import { loadPersistedSettings, persistSettings, syncSettings } from './store/settings-sync'
import { theme } from './theme'

const storage = (() => {
  try {
    return window.localStorage
  } catch {
    return undefined
  }
})()
const settings = loadPersistedSettings(storage)
const store = createStore(settings && { settings })
const queryClient = createQueryClient()
syncSettings(queryClient, store)
if (storage) persistSettings(store, storage)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
        {import.meta.env.DEV && <ReactQueryDevtools />}
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>,
)
