import { log } from '#root/ioc/log.js'
import { initTRPC } from '@trpc/server'
import type { Context } from './context.ts'

const t = initTRPC.context<Context>().create({
  errorFormatter({ shape, error, input, path, type }) {
    if (error.message === 'jwt expired') {
      return
    }

    const code = shape?.data?.code ?? 'UNKNOWN'
    const logMessage = `${code} ${path ?? ''}: ${error.message}`

    if (code === 'BAD_REQUEST') {
      log.warn(
        {
          input: JSON.stringify(input)
        },
        logMessage
      )
    } else {
      log.error(path == null ? error : logMessage, logMessage)
    }

    return shape
  }
})

export const router = t.router
export const publicProcedure = t.procedure
