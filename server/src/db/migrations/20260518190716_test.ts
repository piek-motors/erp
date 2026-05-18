import type { KDB } from '../../db/index.js'

export async function up(db: KDB): Promise<void> {
  console.log('init')
}

export async function down(db: KDB): Promise<void> {}
