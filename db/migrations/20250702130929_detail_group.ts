import { type KDB } from '../schema'
export async function up(db: KDB): Promise<void> {
  await db.schema
    .alterTable('metal_flow.details')
    .addColumn('logical_group_id', 'integer', b =>
      b.references('metal_flow.detail_group.id')
    )
    .execute()
  await db.schema
    .alterTable('metal_flow.details')
    .dropConstraint('details_part_code_key')
    .ifExists()
    .execute()
  await db.schema
    .alterTable('metal_flow.detail_group')
    .dropConstraint('detail_group_name_key')
    .ifExists()
    .execute()
}

export async function down(db: KDB): Promise<void> {
  await db.schema
    .alterTable('metal_flow.details')
    .dropColumn('logical_group_id')
    .execute()
}
