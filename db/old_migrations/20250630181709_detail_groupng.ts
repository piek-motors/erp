import { type KDB } from '../schema'

export async function up(db: KDB): Promise<void> {
  await db.schema
    .createTable('pdo.detail_group')
    .addColumn('id', 'serial', b => b.primaryKey())
    .addColumn('name', 'text', b => b.notNull().unique())
    .execute()

  await db.schema
    .createTable('pdo.detail_group_details')
    .addColumn('group_id', 'integer', b =>
      b.references('pdo.detail_group.id').notNull()
    )
    .addColumn('detail_id', 'integer', b =>
      b.references('pdo.details.id').notNull()
    )
    .addPrimaryKeyConstraint('detail_logical_group_details_pkey', [
      'detail_id',
      'group_id'
    ])
    .execute()
}

export async function down(db: KDB): Promise<void> {
  await db.schema.dropTable('pdo.detail_group_details').execute()
  await db.schema.dropTable('pdo.detail_group').execute()
}
