import { type KDB, sql } from '../index'

export async function up(db: KDB): Promise<void> {
	await sql`
      ALTER TABLE pdo.materials_quarterly_spending
      DROP CONSTRAINT materials_quarterly_spending_material_id_fkey
    `.execute(db)

	await sql`
    ALTER TABLE pdo.materials_quarterly_spending
    ADD CONSTRAINT materials_quarterly_spending_material_id_fkey
    FOREIGN KEY (material_id) REFERENCES pdo.materials(id) ON DELETE CASCADE
  `.execute(db)
}

export async function down(db: KDB): Promise<void> {}
