import { authStore } from '@/lib/store/auth.store'
import { notifier } from '@/lib/store/notifier.store'
import { createTRPCClient, httpLink } from '@trpc/client'
import type { AppRouter } from 'srv/lib/trpc/index.js'

const url = import.meta.env.VITE_RPC_URL
if (!url) {
  throw new Error('VITE_RPC_URL is not set')
}

let refreshTokenPromise: Promise<string> | null = null

const fetchWithTokenRefresh: typeof fetch = async (input, init?) => {
  const resp = await fetch(input, init)
  if (resp.ok) {
    return resp
  }
  // error handling
  const clonedResp = resp.clone()
  const body = await resp.json().catch(() => ({}))
  if (
    body?.error?.message?.includes('jwt expired') ||
    body?.error?.data?.code === 'UNAUTHORIZED'
  ) {
    if (refreshTokenPromise == null) {
      refreshTokenPromise = authStore.refresh().finally(() => {
        refreshTokenPromise = null
      })
    }

    await refreshTokenPromise

    const headers = new Headers(init?.headers)
    headers.set('Authorization', `Bearer ${authStore.token}`)
    return fetch(input, { ...init, headers })
  } else {
    notifier.err(body?.error?.message)
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
            Authorization: `Bearer ${authStore.token}`,
          }
        },
      }),
    ],
  })
