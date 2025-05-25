import { ApolloProvider } from '@apollo/client'
import '@fontsource/inter'
import { createContext } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { apolloClient } from './api/apollo-client'
import App from './app'
import { GlobalStore } from './store/global.store'

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

const container =
  document.getElementById('app') || document.createElement('div')
const root = createRoot(container) // createRoot(container!) if you use TypeScript

root.render(
  <ApolloProvider client={apolloClient}>
    <BrowserRouter>
      <Context.Provider value={{ store }}>
        <App />
      </Context.Provider>
    </BrowserRouter>
  </ApolloProvider>
)
