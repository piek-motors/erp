import { config } from '#root/config/env.js'
import { trpcRouter } from '#root/domains/trpc-router.js'
import errorMiddleware from '#root/lib/middlewares/error.middleware.js'
import { createContext } from '#root/lib/trpc/context.js'
import { router } from '#root/routers/http-routes.js'
import * as trpcExpress from '@trpc/server/adapters/express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import { logger } from './ioc/log.js'
import './lib/trpc/index.js'

const clientBuild = config.BUILD_PATH

process.on('unhandledRejection', (reason, p) => {
	logger.error(
		`Unhandled Rejection at: Promise ${p}, ${reason}`,
		reason instanceof Error ? reason.stack || reason.message : reason,
	)
})

express()
	.use(express.static(clientBuild))
	.use(express.urlencoded({ extended: false }))
	.use(express.json())
	.use(cookieParser())
	.use(
		cors({
			credentials: true,
			origin: [config.CORS_CLIENT_URL],
		}),
	)
	.use('/api', router)
	.use(
		'/trpc',
		trpcExpress.createExpressMiddleware({
			router: trpcRouter,
			createContext,
		}) as any,
	)
	.use((err, req, res, next) => {
		errorMiddleware(err, req, res, next)
	})
	.get('*', (_, response) => {
		// All remaining requests return the React app, so it can handle routing.
		response.sendFile('index.html', { root: clientBuild })
	})
	.listen(config.PORT, async () => {
		logger.info(
			`🛫 Express running in ${config.NODE_ENV} mode on port ${config.PORT}`,
		)
	})
