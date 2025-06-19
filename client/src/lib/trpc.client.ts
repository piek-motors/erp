import { createTRPCClient, httpBatchLink } from '@trpc/client'
import { getInMemoryToken } from 'index'
// @ts-ignore
import type { AppRouter } from '../../../server/src/trpc'

const url = process.env.REACT_APP_RPC_URL
if (!url) {
  throw new Error('REACT_APP_RPC_URL is not set')
}

export const rpc: ReturnType<typeof createTRPCClient<AppRouter>> =
  createTRPCClient<AppRouter>({
    links: [
      httpBatchLink({
        url,
        headers: () => {
          return {
            Authorization: `Bearer ${getInMemoryToken()}`
          }
        }
      })
    ]
  })
