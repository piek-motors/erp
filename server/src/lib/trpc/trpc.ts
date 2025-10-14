import { log } from '#root/ioc/log.js'
import { initTRPC } from '@trpc/server'
import type { Context } from './context.ts'
/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */

const t = initTRPC.context<Context>().create({
  errorFormatter({ shape, error }) {
    if (error.message === 'jwt expired') {
      return
    }

    log.error(error, `[${error.name}] ${error.message}`)
    return shape
  }
})

/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const router = t.router
export const publicProcedure = t.procedure
