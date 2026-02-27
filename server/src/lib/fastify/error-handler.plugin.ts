import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { StatusCodes } from 'http-status-codes'
import { logger } from '#root/ioc/log.js'
import { ApiError } from '#root/lib/api.error.js'
import { Errcode } from '#root/lib/error-code.js'

export async function errorHandlerPlugin(fastify: FastifyInstance) {
  fastify.setErrorHandler((error, request, reply) => {
    if (error instanceof ApiError) {
      return reply.status(error.status).send({
        error: {
          message: error.message,
          code: error.status,
        },
      })
    }

    logger.error(error, 'Unhandled internal error')
    return reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: {
        message: Errcode.UNKNOWN_ERROR_TRY_AGAIN,
        code: StatusCodes.INTERNAL_SERVER_ERROR,
      },
    })
  })
}
