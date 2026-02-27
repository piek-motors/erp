import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { tokenService } from '#root/ioc/index.js'
import { logger } from '#root/ioc/log.js'
import { ApiError } from '#root/lib/api.error.js'
import { Errcode } from '#root/lib/error-code.js'

export async function authPlugin(fastify: FastifyInstance) {
  fastify.decorateRequest('user', null)

  fastify.addHook('onRequest', async (request, reply) => {
    // Skip auth for public routes
    if (
      request.raw.url?.startsWith('/login') ||
      request.raw.url?.startsWith('/logout') ||
      request.raw.url?.startsWith('/refresh')
    ) {
      return
    }
  })
}

export function authMiddleware(request: FastifyRequest, reply: FastifyReply) {
  try {
    const authorizationHeader = request.headers.authorization
    if (!authorizationHeader) {
      throw ApiError.Unauthorized(Errcode.MISSING_AUTH_HEADER)
    }
    const accessToken = authorizationHeader.split(' ')[1]
    if (!accessToken) {
      throw ApiError.Unauthorized(Errcode.MISSING_AUTH_HEADER)
    }
    const user = tokenService.verifyAccess(accessToken)
    if (!user) {
      throw ApiError.Unauthorized(Errcode.INVALID_ACCESS_TOKEN)
    }
  } catch (e) {
    logger.error(e)
    throw ApiError.Unauthorized(Errcode.UNKNOWN_ERROR_TRY_AGAIN)
  }
}
