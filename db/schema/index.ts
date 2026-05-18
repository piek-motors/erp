import type {
  Kysely,
  Selectable as KyselySelectable,
  Updateable as KyselyUpdateable,
} from 'kysely'
import type { Database } from './schema.js'

export type KDB = Kysely<Database>
export type Selectable<T> = KyselySelectable<T>
export type Updateable<T> = KyselyUpdateable<T>

export * as DB from './schema.js'
