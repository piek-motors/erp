import { log } from '#root/ioc/log.js'
import { initTRPC } from '@trpc/server'
import type { Context } from './context.ts'
/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */

const t = initTRPC.context<Context>().create({
  errorFormatter({ shape, error, path, type, input }) {
    if (error.message === 'jwt expired') {
      return
    }
    const procedurePath = path ? `${type}.${path}` : 'unknown'
    const inputData = input
      ? JSON.stringify(input, null, 2).substring(0, 500)
      : 'N/A'
    const errorDetails = [
      `[${error.name}] ${error.message}`,
      `Procedure: ${procedurePath}`,
      `Input: ${inputData}`,
      `Stack: ${error.stack || 'N/A'}`
    ].join('\n')
    log.error(error, errorDetails)
    return shape
  }
})

/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const router = t.router
export const publicProcedure = t.procedure
