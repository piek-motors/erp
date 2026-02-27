import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import fastify from 'fastify'
import { config } from '#root/config/env.js'
import { trpcRouter } from '#root/domains/trpc-router.js'
import { httpRoutes } from '#root/routers/http-routes.js'
import { errorHandlerPlugin } from '#root/lib/fastify/error-handler.plugin.js'
import { logger } from './ioc/log.js'
import './lib/trpc/index.js'

const clientBuild = resolve(config.BUILD_PATH)
const clientBuildExists = existsSync(clientBuild)

process.on('unhandledRejection', (reason, p) => {
  logger.error(
    `Unhandled Rejection at: Promise ${p}, ${reason}`,
    reason instanceof Error ? reason.stack || reason.message : reason,
  )
})

const app = fastify({
  logger: false,
  routerOptions: {
    ignoreTrailingSlash: true,
  },
})

await app.register(import('@fastify/cors'), {
  credentials: true,
  origin: [config.CORS_CLIENT_URL],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'orderid', 'detailid'],
  exposedHeaders: ['Content-Disposition'],
})
await app.register(import('@fastify/cookie'), {
  secret: config.JWT_ACCESS_SECRET,
})
await app.register(import('@fastify/formbody'))
await app.register(import('@fastify/multipart'), {
  limits: {
    files: 20,
  },
})
await app.register(errorHandlerPlugin)

// Serve static files only if build exists
if (clientBuildExists) {
  await app.register(import('@fastify/static'), {
    root: clientBuild,
    wildcard: true,
  })
} else {
  logger.warn(
    `Client build not found at ${clientBuild}, skipping static file serving`,
  )
}

// Register HTTP API routes
await app.register(httpRoutes, { prefix: '/api' })

// Register tRPC routes
const { createContext } = await import('#root/lib/fastify/trpc-context.js')
const { fastifyTRPCPlugin } = await import('@trpc/server/adapters/fastify')

await app.register(fastifyTRPCPlugin, {
  prefix: '/trpc',
  trpcOptions: {
    router: trpcRouter,
    createContext,
  },
} as any)

// Serve React app only if build exists
if (clientBuildExists) {
  app.setNotFoundHandler((request, reply) => {
    // For SPA routing, serve index.html for all non-API routes
    if (!request.url.startsWith('/api') && !request.url.startsWith('/trpc')) {
      reply.sendFile('index.html')
    } else {
      reply.status(404).send({ error: 'Not found' })
    }
  })
}

await app.listen({ port: config.PORT, host: '0.0.0.0' })

logger.info(
  `🛫 Fastify running in ${config.NODE_ENV} mode on port ${config.PORT}`,
)
