import { type KDB } from '../schema'

export async function up(db: KDB): Promise<void> {
  await db.schema.dropTable('pdo.writeoffs').execute()
  await db.schema.dropTable('pdo.supplies').execute()
}

export async function down(db: KDB): Promise<void> {}
