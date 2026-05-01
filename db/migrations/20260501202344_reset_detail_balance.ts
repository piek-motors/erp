import type { KDB } from '../schema.js'

export async function up(db: KDB): Promise<void> {
  await db.updateTable('pdo.details').set({ on_hand_balance: 0 }).execute()
}

export async function down(db: KDB): Promise<void> {}
