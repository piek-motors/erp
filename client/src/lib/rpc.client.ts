import { createTRPCClient, httpLink } from '@trpc/client'
import { getInMemoryToken, getNewInMemoryToken } from 'index'
import type { AppRouter } from 'srv/lib/trpc/index.js'

const url = process.env.REACT_APP_RPC_URL
if (!url) {
  throw new Error('REACT_APP_RPC_URL is not set')
}

let refreshTokenPromise: Promise<string> | null = null

const fetchWithTokenRefresh: typeof fetch = async (input, init?) => {
  const resp = await fetch(input, init)
  if (resp.ok) {
    return resp
  }
  const clonedResp = resp.clone()
  const body = await resp.json().catch(() => ({}))
  if (
    body?.error?.message?.includes('jwt expired') ||
    body?.error?.data?.code === 'UNAUTHORIZED'
  ) {
    if (refreshTokenPromise == null) {
      refreshTokenPromise = getNewInMemoryToken().finally(() => {
        refreshTokenPromise = null
      })
    }

    await refreshTokenPromise

    const headers = new Headers(init?.headers)
    headers.set('Authorization', `Bearer ${getInMemoryToken()}`)
    return fetch(input, { ...init, headers })
  }
  return clonedResp
}

export const rpc: ReturnType<typeof createTRPCClient<AppRouter>> =
  createTRPCClient<AppRouter>({
    links: [
      httpLink({
        url,
        fetch: fetchWithTokenRefresh,
        headers: () => {
          return {
            Authorization: `Bearer ${getInMemoryToken()}`
          }
        }
      })
    ]
  })
