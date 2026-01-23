import type { KDB } from '../schema'

export async function up(db: KDB): Promise<void> {
	await db.schema
		.createTable('pdo.dict_operation_kinds')
		.addColumn('id', 'serial', col => col.primaryKey())
		.addColumn('v', 'text', col => col.notNull().unique())
		.execute()
}

export async function down(db: KDB): Promise<void> {
	await db.schema.dropTable('pdo.dict_operation_kinds').execute()
}
