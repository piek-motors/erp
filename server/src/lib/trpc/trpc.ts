import { log } from '#root/ioc/log.js'
import { initTRPC } from '@trpc/server'
import type { Context } from './context.ts'

const t = initTRPC.context<Context>().create({
  errorFormatter({ shape, error, input }) {
  errorFormatter({ shape, error, input }) {
    if (error.message === 'jwt expired') {
      return
    }
    log.error(
      {
        code: shape.data.code,
        rpc: shape.data.path,
        input
      },
      `${error.name} rpc=${shape.data.path} code=${shape.data.code}: ${error.message}`
    )
    return shape
  }
})

export const router = t.router
export const publicProcedure = t.procedure
