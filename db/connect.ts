import { Kysely, PostgresDialect } from 'kysely'
import pg from 'pg'
import type { Database } from 'schema/index.js'

export function connect(connectionString: string) {
  console.log('Connecting to database...')
  return new Kysely<Database>({
    dialect: new PostgresDialect({
      pool: new pg.Pool({
        connectionString,
        ssl: false,
        max: 2,
      }),
    }),
  })
}
