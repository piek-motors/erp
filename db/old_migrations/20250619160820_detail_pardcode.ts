import { type KDB } from '../schema'
export async function up(db: KDB): Promise<void> {
  await db.schema
    .alterTable('pdo.details')
    .addColumn('part_code', 'text', b => b.unique())
    .execute()
}

export async function down(db: KDB): Promise<void> {
  await db.schema.alterTable('pdo.details').dropColumn('part_code').execute()
}
