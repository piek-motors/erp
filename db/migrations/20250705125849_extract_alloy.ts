import { sql } from 'kysely'
import { type KDB } from '../schema'

export async function up(db: KDB): Promise<void> {
  await sql`
    ALTER TABLE metal_flow.materials
    ADD COLUMN alloy TEXT;
  `.execute(db)

  // load exising alloy from shape_data and save to alloy column
  const materials = await db
    .selectFrom('metal_flow.materials')
    .selectAll()
    .execute()

  for (const material of materials) {
    const shapeData = material.shape_data
    const alloy = shapeData.alloy
    if (!alloy) continue
    await db
      .updateTable('metal_flow.materials')
      .set({ alloy })
      .where('id', '=', material.id)
      .execute()
  }
}

export async function down(db: KDB): Promise<void> {
  await sql`
    ALTER TABLE metal_flow.materials
    DROP COLUMN alloy;
  `.execute(db)
}
