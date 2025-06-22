import { rpcRouter } from '#root/rpc-router.js'
export * from '#root/lib/trpc/trpc.js'
export type AppRouter = typeof rpcRouter
