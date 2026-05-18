import type { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  // Add parent_id column to detail_group table
  await db.schema
    .alterTable('pdo.detail_group')
    .addColumn('parent_id', 'integer', col =>
      col
        .references('pdo.detail_group.id')
        .onDelete('cascade')
        .onUpdate('cascade'),
    )
    .execute()

  // Add index for better performance when querying by parent_id
  await db.schema
    .createIndex('idx_detail_group_parent_id')
    .on('pdo.detail_group')
    .column('parent_id')
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  // Drop the index
  await db.schema.dropIndex('idx_detail_group_parent_id').execute()

  // Drop the parent_id column
  await db.schema
    .alterTable('pdo.detail_group')
    .dropColumn('parent_id')
    .execute()
}
