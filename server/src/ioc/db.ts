import { connect } from 'db'
import { config } from '#root/config/env.js'

if (!config.PG_CONN_STR) {
	throw new Error('PG_CONN_STR is not set')
}

export const db = connect(config.PG_CONN_STR)
