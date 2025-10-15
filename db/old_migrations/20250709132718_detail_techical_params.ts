import { type KDB } from '../schema'

export async function up(db: KDB): Promise<void> {
  await db.schema
    .alterTable('metal_flow.details')
    .addColumn('params', 'jsonb')
    .execute()
}

export async function down(db: KDB): Promise<void> {
  await db.schema
    .alterTable('metal_flow.details')
    .dropColumn('params')
    .execute()
}
