import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import { config } from './config.ts'
import errorMiddleware from './middlewares/error.middleware.ts'
import { router } from './routes.ts'

const clientBuild = config.BUILD_PATH

export const app = express()

process.on('unhandledRejection', (reason, p) => {
  console.error('Unhandled Rejection at: Promise', p, 'reason:', reason)
  // application specific logging, throwing an error, or other logic here
})

// Static files
app.use(express.static(clientBuild))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cookieParser())
app.use(
  cors({
    credentials: true,
    origin: config.CORS_CLIENT_URL
  })
)
app.use('/api', router)
app.use(errorMiddleware)

// All remaining requests return the React app, so it can handle routing.
app.get('*', function (request, response) {
  response.sendFile('index.html', { root: clientBuild })
})

app.listen(config.PORT, async () => {
  console.log(
    '🛫 Express running in',
    config.NODE_ENV,
    'mode on port',
    config.PORT
  )
})
