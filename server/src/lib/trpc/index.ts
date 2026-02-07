import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import type { trpcRouter } from '#root/domains/trpc-router.js'

export * from '#root/lib/trpc/trpc.js'

export type AppRouter = typeof trpcRouter
export type RouterInput = inferRouterInputs<AppRouter>
export type RouterOutput = inferRouterOutputs<AppRouter>
