import type { KDB } from '../schema.js'

export async function up(db: KDB): Promise<void> {
  await db.schema
    .createTable('pdo.materials_quarterly_spending')
    .addColumn('material_id', 'integer', b =>
      b.primaryKey().references('pdo.materials.id'),
    )
    .addColumn('total_income', 'numeric')
    .addColumn('total_outcome', 'numeric')
    .execute()
}

export async function down(db: KDB): Promise<void> {
  await db.schema.dropTable('pdo.materials_quarterly_spending').execute()
}
