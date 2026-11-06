import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import App from './App.tsx'
import { createQueryClient } from './api/query/query-client'
import { createStore } from './store'
import { theme } from './theme'
import './index.css'

const store = createStore()
const queryClient = createQueryClient()

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
