import { type KDB } from '../schema'

export async function up(db: KDB): Promise<void> {
  await db
    .updateTable('pdo.materials')
    .set({
      stock: eb => eb('stock', '/', 1000)
    })
    .execute()
}

export async function down(db: KDB): Promise<void> {}
