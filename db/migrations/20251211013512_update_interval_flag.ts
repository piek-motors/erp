import type { KDB } from '../schema'

export async function up(db: KDB): Promise<void> {
	await db.schema
		.alterTable('attendance.intervals')
		.addColumn('updated_manually', 'boolean')
		.execute()
}

export async function down(db: KDB): Promise<void> {
	await db.schema
		.alterTable('attendance.intervals')
		.dropColumn('updated_manually')
		.execute()
}
