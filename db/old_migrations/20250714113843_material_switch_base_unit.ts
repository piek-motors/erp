import { Unit } from 'models'
import type { KDB } from '../schema'

export async function up(db: KDB): Promise<void> {
	await db.deleteFrom('pdo.operations').execute()
	await db.deleteFrom('pdo.orders').execute()
	await db
		.updateTable('pdo.materials')
		.set({
			stock: 0,
			unit: Unit.MilliMeter,
		})
		.execute()
	await db
		.updateTable('pdo.details')
		.set({
			stock: 0,
		})
		.execute()
}

export async function down(db: KDB): Promise<void> {}
