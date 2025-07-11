import { pino } from 'pino'
import pretty from 'pino-pretty'

const logLevel = process.env.LOG_LEVEL || 'info'
const ignoreScript = ['pid', 'hostname', 'level-label']

export const log = pino(
  pretty({ colorize: true, ignore: ignoreScript.join(',') })
)
