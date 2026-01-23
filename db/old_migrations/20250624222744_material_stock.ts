import type { KDB } from '../schema'

export async function up(db: KDB): Promise<void> {
	await db.schema
		.alterTable('pdo.materials')
		.addColumn('stock', 'numeric', eb => eb.defaultTo(0))
		.execute()

	await db.schema
		.alterTable('pdo.details')
		.addColumn('stock', 'int8', eb => eb.defaultTo(0))
		.execute()
}

export async function down(db: KDB): Promise<void> {
	await db.schema.alterTable('pdo.materials').dropColumn('stock').execute()
	await db.schema.alterTable('pdo.details').dropColumn('stock').execute()
}
