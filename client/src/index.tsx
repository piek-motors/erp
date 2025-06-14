import { ApolloProvider } from '@apollo/client'
import { loadDevMessages, loadErrorMessages } from '@apollo/client/dev'
import { __DEV__ } from '@apollo/client/utilities/globals'
import '@fontsource/inter'
import { CssBaseline, ThemeProvider } from '@mui/joy'
import { observer } from 'mobx-react-lite'
import { createContext } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { NetworkStatusMessage } from './components/network-status-hint'
import { NotifierOverlay } from './components/notifier'
import { apolloClient } from './lib/api/apollo-client'
import { AppRouter } from './lib/routers/Router'
import { GlobalStore } from './store/global.store'
import theme from './theme'

if (__DEV__) {
  loadDevMessages()
  loadErrorMessages()
}

const store = new GlobalStore()

export const Context = createContext({
  store
})

export function getInMemoryToken() {
  return store.inMemoryToken
}

export async function getNewInMemoryToken() {
  return await store.getNewToken()
}

const App = observer(() => {
  return (
    <>
      <NotifierOverlay />
      <NetworkStatusMessage />
      <AppRouter />
    </>
  )
})

const container =
  document.getElementById('app') || document.createElement('div')
const root = createRoot(container) // createRoot(container!) if you use TypeScript

root.render(
  <ApolloProvider client={apolloClient}>
    <BrowserRouter>
      <Context.Provider value={{ store }}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </Context.Provider>
    </BrowserRouter>
  </ApolloProvider>
)
