import { type KDB } from '../schema'

export async function up(db: KDB): Promise<void> {
  await db.deleteFrom('pdo.operations').execute()
  await db.schema
    .alterTable('pdo.operations')
    .addColumn('reason', 'integer', eb => eb.notNull())
    .execute()
}

export async function down(db: KDB): Promise<void> {
  await db.schema.alterTable('pdo.operations').dropColumn('reason').execute()
}
