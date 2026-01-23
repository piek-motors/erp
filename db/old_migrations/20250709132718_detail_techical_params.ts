import type { KDB } from '../schema'

export async function up(db: KDB): Promise<void> {
	await db.schema
		.alterTable('pdo.details')
		.addColumn('params', 'jsonb')
		.execute()
}

export async function down(db: KDB): Promise<void> {
	await db.schema.alterTable('pdo.details').dropColumn('params').execute()
}
