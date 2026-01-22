import { initTRPC } from '@trpc/server'
import { logger } from '#root/ioc/log.js'
import type { Context } from './context.ts'

const skipLoggingForCodes = new Set(['FORBIDDEN'])

export const t = initTRPC.context<Context>().create({
	errorFormatter({ shape, error, input, path }) {
		if (error.message === 'jwt expired') {
			return shape
		}

		const code = shape?.data?.code ?? 'UNKNOWN'
		const logMessage = `${code} ${path ?? ''}: ${error.message}`

		if (skipLoggingForCodes.has(code)) {
			return shape
		} else if (code === 'BAD_REQUEST') {
			logger.warn(
				{
					input: JSON.stringify(input),
				},
				logMessage,
			)
		} else {
			logger.error(path == null ? error : logMessage, logMessage)
		}

		return shape
	},
})

export const router = t.router
export const procedure = t.procedure
