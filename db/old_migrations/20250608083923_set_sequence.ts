import { sql } from 'kysely'
import { type KDB } from '../schema'

export async function up(db: KDB): Promise<void> {
  const materialsMaxId = await db
    .selectFrom('pdo.materials')
    .select('id')
    .orderBy('id', 'desc')
    .limit(1)
    .executeTakeFirstOrThrow()

  const detailsMaxId = await db
    .selectFrom('pdo.details')
    .select('id')
    .orderBy('id', 'desc')
    .limit(1)
    .executeTakeFirstOrThrow()

  const materialNextId = materialsMaxId.id + 1
  const detailNextId = detailsMaxId.id + 1

  const q = sql`
      ALTER SEQUENCE pdo.materials_id_seq RESTART WITH ${sql.raw(
        materialNextId.toString()
      )};
      ALTER SEQUENCE pdo.details_id_seq RESTART WITH ${sql.raw(
        detailNextId.toString()
      )};
    `.compile(db)

  await db.executeQuery(q)
}

export async function down(db: KDB): Promise<void> {}
