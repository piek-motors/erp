import { sql } from 'kysely'
import { type KDB } from '../schema'

export const up = async (db: KDB) => {
  await db.schema.alterTable('erp.users').setSchema('public').execute()
  await db.schema.alterTable('erp.refresh_tokens').setSchema('public').execute()
  await sql`ALTER SCHEMA erp RENAME TO orders`.execute(db)
  await sql`ALTER SCHEMA metal_pdo RENAME TO metal_flow`.execute(db)

  await db.schema
    .alterTable('public.users')
    .renameColumn('UserID', 'id')
    .execute()

  await db.schema
    .alterTable('public.users')
    .renameColumn('FirstName', 'first_name')
    .execute()

  await db.schema
    .alterTable('public.users')
    .renameColumn('LastName', 'last_name')
    .execute()
  await db.schema
    .alterTable('public.users')
    .renameColumn('Password', 'password')
    .execute()

  await db.schema
    .alterTable('public.users')
    .renameColumn('Email', 'email')
    .execute()
}

export const down = async (db: KDB) => {
  await db.schema.alterTable('public.users').setSchema('orders').execute()
  await db.schema
    .alterTable('public.refresh_tokens')
    .setSchema('orders')
    .execute()

  await db.schema
    .alterTable('orders.users')
    .renameColumn('id', 'UserID')
    .execute()

  await sql`ALTER SCHEMA orders RENAME TO erp`.execute(db)
  await sql`ALTER SCHEMA metal_flow RENAME TO metal_flow`.execute(db)
}
