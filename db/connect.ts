import { Kysely, PostgresDialect } from 'kysely'
import pg from 'pg'
import type { DB } from './schema'

export function connect(connectionString: string) {
	console.log('Connecting to database...')
	return new Kysely<DB.Schema>({
		dialect: new PostgresDialect({
			pool: new pg.Pool({
				connectionString,
				ssl: false,
				max: 2,
			}),
		}),
	})
}
