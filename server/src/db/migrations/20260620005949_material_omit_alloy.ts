import { type KDB, sql } from '../../db/index.js'

export async function up(db: KDB): Promise<void> {
  await sql`ALTER TABLE pdo.materials DROP CONSTRAINT IF EXISTS materials_label_key`.execute(
    db,
  )

  const materials = await db.selectFrom('pdo.materials').selectAll().execute()
  for (const m of materials) {
    if (m.alloy) {
      const label = m.label.replace(m.alloy, '')
      await db
        .updateTable('pdo.materials')
        .set({ label })
        .where('id', '=', m.id)
        .execute()
    }
  }

  await sql`
    CREATE UNIQUE INDEX IF NOT EXISTS materials_label_alloy_idx
    ON pdo.materials (label, alloy)
  `.execute(db)
}

export async function down(_db: KDB): Promise<void> {}
