import { type KDB } from '../schema'

export async function up(db: KDB): Promise<void> {
	await db.schema
		.alterTable('pdo.materials')
		.renameColumn('stock', 'on_hand_balance')
		.execute()
	await db.schema
		.alterTable('pdo.details')
		.renameColumn('stock', 'on_hand_balance')
		.execute()

	await db.schema
		.alterTable('pdo.details')
		.renameColumn('automatic_writeoff', 'blank')
		.execute()

	await db.schema
		.alterTable('pdo.details')
		.renameColumn('part_code', 'drawing_number')
		.execute()
}

export async function down(db: KDB): Promise<void> {
	await db.schema
		.alterTable('pdo.materials')
		.renameColumn('on_hand_balance', 'stock')
		.execute()
	await db.schema
		.alterTable('pdo.details')
		.renameColumn('on_hand_balance', 'stock')
		.execute()

	await db.schema
		.alterTable('pdo.details')
		.renameColumn('blank', 'automatic_writeoff')
		.execute()

	await db.schema
		.alterTable('pdo.details')
		.renameColumn('drawing_number', 'part_code')
		.execute()
}
