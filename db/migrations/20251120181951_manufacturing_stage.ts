import { type KDB } from '../schema'

export async function up(db: KDB): Promise<void> {
  await db.schema
    .alterTable('pdo.manufacturing')
    .addColumn('current_operation', 'smallint')
    .execute()
}

export async function down(db: KDB): Promise<void> {
  await db.schema
    .alterTable('pdo.manufacturing')
    .dropColumn('current_operation')
    .execute()
}
