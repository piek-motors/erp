import { Kysely, PostgresDialect } from 'kysely'
import pg from 'pg'
import { config } from '../config.ts'
import type { DB } from './schema.ts'

console.log('Connecting to database...', config.PG_CONN_STR)
export const db = new Kysely<DB.Schema>({
  dialect: new PostgresDialect({
    pool: new pg.Pool({
      connectionString: config.PG_CONN_STR,
      ssl: false,
      max: 1
    })
  })
})
