import type { KDB } from '../../db/index.js'

export async function up(db: KDB): Promise<void> {
  await db.schema
    .alterTable('pdo.operations')
    .renameTo('inventory_log')
    .execute()
  await db.schema
    .dropTable('pdo.detail_group_color_annotations')
    .ifExists()
    .execute()
}

export async function down(db: KDB): Promise<void> {}
