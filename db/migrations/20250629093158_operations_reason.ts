import { type KDB } from '../schema'

export async function up(db: KDB): Promise<void> {
  await db.schema
    .alterTable('metal_flow.operations')
    .addColumn('reason', 'integer', eb => eb.notNull())
    .execute()
}

export async function down(db: KDB): Promise<void> {
  await db.schema
    .alterTable('metal_flow.operations')
    .dropColumn('reason')
    .execute()
}
