import type { KDB } from '../schema'
export async function up(db: KDB): Promise<void> {
	await db.schema
		.alterTable('pdo.detail_group')
		.dropConstraint('detail_name_unique_idx')
		.ifExists()
		.execute()
}

export async function down(db: KDB): Promise<void> {}
