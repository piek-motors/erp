import type { Insertable, Selectable, Updateable } from 'kysely'
import type { KDB } from './schema.js'

export * as DB from './schema.js'
export type { KDB, Selectable, Updateable, Insertable }
