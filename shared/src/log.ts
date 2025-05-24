import { pino } from 'pino'
let logInstance: pino.Logger

export function initLogger(level = 'info') {
  if (!logInstance) {
    console.log('Initializing logger with level:', level)
    const ignoreScript = ['pid', 'hostname', 'level-label']

    if (process.env.LOG_DISABLE_TIMESTAMP === 'true') {
      ignoreScript.push('time')
    }

    const wsLogServerPort = process.env.WS_LOG_SERVER_PORT || 16733
    if (!wsLogServerPort) {
      console.error('WS_LOG_SERVER_PORT not set, using default port 16733')
    }

    logInstance = pino({
      level,
      transport: {
        targets: [
          {
            target: 'pino-pretty',
            options: {
              colorize: true,
              ignore: ignoreScript.join(','),
              translateTime: 'dd-mm-yy HH:MM:ss'
            }
          }
        ]
      },
      timestamp: pino.stdTimeFunctions.isoTime
    })
  }
  return logInstance
}

// Export proxy object that warns if not initialized
export const log = new Proxy({} as pino.Logger, {
  get(_target, prop) {
    if (!logInstance) {
      throw new Error('Logger not initialized. Call initLogger() first.')
    }
    return logInstance[prop as keyof pino.Logger]
  }
})
