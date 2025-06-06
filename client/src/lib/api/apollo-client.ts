import { ApolloClient, InMemoryCache, from } from '@apollo/client'
import { webSocketLink, wsErrorLink, wsRetryLink } from './apollo-ws-links'

export const apolloClient = new ApolloClient({
  link: from([wsRetryLink, wsErrorLink, webSocketLink]),
  cache: new InMemoryCache()
})
