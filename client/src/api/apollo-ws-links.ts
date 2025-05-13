import { onError } from '@apollo/client/link/error'
import { RetryLink } from '@apollo/client/link/retry'
import { WebSocketLink } from '@apollo/client/link/ws'
import { getInMemoryToken } from '..'

const ws_protocol =
  process.env.REACT_APP_NODE_ENV === 'development' ? 'ws://' : 'wss://'

export const wsRetryLink = new RetryLink({
  delay: {
    initial: 300,
    max: Infinity,
    jitter: true
  },
  attempts: {
    max: 100,
    retryIf: (error, _operation) => !!error
  }
})

export const wsErrorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    if (networkError) {
      console.log('[Network error]: ', networkError)
    }

    if (graphQLErrors)
      graphQLErrors.forEach(({ message, locations, path }) =>
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        )
      )
  }
)

export const webSocketLink = new WebSocketLink({
  uri: ws_protocol + process.env.REACT_APP_HASURA_ENDPOINT,
  options: {
    reconnect: true,
    lazy: true,
    inactivityTimeout: 30_000,
    connectionParams: () => ({
      headers: {
        authorization: `Bearer ${getInMemoryToken()}`
      }
    })
  }
})
