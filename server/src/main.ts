import { router } from '#root/adapters/routers/http-routes.js'
import { config } from '#root/config.js'
import errorMiddleware from '#root/lib/middlewares/error.middleware.js'
import { createContext } from '#root/lib/trpc/context.js'
import { trpcRouter } from '#root/procedures/trpc-router.js'
import * as trpcExpress from '@trpc/server/adapters/express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import { log } from './ioc/log.js'
import './lib/trpc/index.js'

const clientBuild = config.BUILD_PATH

process.on('unhandledRejection', (reason, p) => {
  log.error('Unhandled Rejection at: Promise', p, 'reason:', reason)
})

express()
  .use(express.static(clientBuild))
  .use(express.urlencoded({ extended: false }))
  .use(express.json())
  .use(cookieParser())
  .use(
    cors({
      credentials: true,
      origin: [config.CORS_CLIENT_URL]
    })
  )
  .use('/api', router)
  .use(
    '/trpc',
    trpcExpress.createExpressMiddleware({
      router: trpcRouter,
      createContext
    })
  )
  .use((err, req, res, next) => {
    errorMiddleware(err, req, res, next)
  })
  .get('*', function (request, response) {
    // All remaining requests return the React app, so it can handle routing.
    response.sendFile('index.html', { root: clientBuild })
  })
  .listen(config.PORT, async () => {
    log.info(
      `🛫 Express running in ${config.NODE_ENV} mode on port ${config.PORT}`
    )
  })
