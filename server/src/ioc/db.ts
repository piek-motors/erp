import { config } from '#root/env.js'
import { connect } from 'db'

if (!config.PG_CONN_STR) {
  throw new Error('PG_CONN_STR is not set')
}

export const db = connect(config.PG_CONN_STR)
