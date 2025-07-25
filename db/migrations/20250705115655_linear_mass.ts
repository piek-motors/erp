import { sql } from 'kysely'
import { type KDB } from '../schema'

export async function up(db: KDB): Promise<void> {
  await sql`
    ALTER TABLE metal_flow.materials ADD COLUMN linear_mass REAL DEFAULT 0;
  `.execute(db)

  // extract existing linear mass from material.shape_data.linearMass
  const materials = await db
    .selectFrom('metal_flow.materials')
    .select(['id', 'shape_data'])
    .execute()

  for (const material of materials) {
    const linearMass = material.shape_data.linearMass
    if (linearMass) {
      await db
        .updateTable('metal_flow.materials')
        .set({ linear_mass: linearMass })
        .where('id', '=', material.id)
        .execute()
    }
  }
}

export async function down(db: KDB): Promise<void> {
  await sql`
    ALTER TABLE metal_flow.materials DROP COLUMN linear_mass;
  `.execute(db)
}
