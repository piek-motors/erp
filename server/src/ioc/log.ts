import { pino } from 'pino'
import pretty from 'pino-pretty'

const ignoreScript = ['pid', 'hostname', 'level-label']

export const logger = pino(
	pretty({ colorize: true, ignore: ignoreScript.join(',') }),
)
