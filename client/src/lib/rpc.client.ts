import { createTRPCClient, httpLink } from '@trpc/client'
import { getInMemoryToken } from 'index'
import type { AppRouter } from '../../../server/src/lib/trpc/index.js'

const url = process.env.REACT_APP_RPC_URL
if (!url) {
  throw new Error('REACT_APP_RPC_URL is not set')
}

export const rpc: ReturnType<typeof createTRPCClient<AppRouter>> =
  createTRPCClient<AppRouter>({
    links: [
      httpLink({
        url,
        headers: () => {
          return {
            Authorization: `Bearer ${getInMemoryToken()}`
          }
        }
      })
    ]
  })
