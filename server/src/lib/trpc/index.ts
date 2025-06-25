import { rpcRouter } from '#root/rpc-router.js'
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
export * from '#root/lib/trpc/trpc.js'

export type AppRouter = typeof rpcRouter
export type RouterInput = inferRouterInputs<AppRouter>
export type RouterOutput = inferRouterOutputs<AppRouter>
