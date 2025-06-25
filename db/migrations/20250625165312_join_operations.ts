import { type KDB } from '../schema'

export async function up(db: KDB): Promise<void> {
  await db.schema.dropTable('metal_flow.writeoffs').execute()
  await db.schema.dropTable('metal_flow.supplies').execute()
}

export async function down(db: KDB): Promise<void> {}
