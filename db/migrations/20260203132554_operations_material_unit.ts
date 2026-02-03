import { type KDB } from '../schema'

export async function up(db: KDB): Promise<void> {
  await db.schema
    .alterTable('pdo.operations')
    .addColumn('material_unit', 'smallint')
    .execute()
  await db.schema.alterTable('pdo.details').dropColumn('blank_spec').execute()
}

export async function down(db: KDB): Promise<void> {
  await db.schema
    .alterTable('pdo.operations')
    .dropColumn('material_unit')
    .execute()
  await db.schema
    .alterTable('pdo.details')
    .addColumn('blank_spec', 'jsonb')
    .execute()
}
