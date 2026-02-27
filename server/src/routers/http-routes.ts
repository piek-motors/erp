import type { FastifyInstance } from 'fastify'
import {
  getBinaryFile,
  uploadBinaryFiles,
} from '#root/domains/attachment/s3_controller.js'
import { userController } from '#root/ioc/index.js'
import { logger } from '#root/ioc/log.js'
import { handleFileUpload } from '#root/lib/fastify/multipart.plugin.js'

export async function httpRoutes(fastify: FastifyInstance) {
  fastify.post('/login', {
    schema: {
      body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string' },
        },
      },
    },
    handler: async (request, reply) => {
      try {
        return await userController.login(request as any, reply)
      } catch (err) {
        logger.error(err, 'Login error')
        throw err
      }
    },
  })

  fastify.post('/logout', async (request, reply) => {
    try {
      return await userController.logout(request, reply)
    } catch (err) {
      logger.error(err, 'Logout error')
      throw err
    }
  })

  fastify.get('/refresh', async (request, reply) => {
    try {
      return await userController.refresh(request, reply)
    } catch (err) {
      logger.error(err, 'Refresh error')
      throw err
    }
  })

  fastify.put('/s3', {
    preHandler: async (request, reply) => {
      const files = await handleFileUpload(request, reply)
      ;(request as any).files = files
    },
    handler: uploadBinaryFiles,
  })

  fastify.get('/s3/:key', getBinaryFile)
}
