import { config } from '#root/config/env.js'
import { connect } from '#root/db/index.js'

if (!config.PG_CONN_STR) {
  throw new Error('PG_CONN_STR is not set')
}

export const db: ReturnType<typeof connect> = connect(config.PG_CONN_STR)
