import { sql } from 'kysely'
import { MaterialRequirement } from 'models'
import { type KDB } from '../schema'

type MaterialId = number
type Cost = number

interface MetalBlank {
	material: [MaterialId, Cost] | null
	details: {
		detail_id: number
		qty: number
	}[]
}

interface Detail {
	id: number
	blank_spec: any
	blank: MetalBlank
}

export async function up(db: KDB): Promise<void> {
	const details = (await sql`
		SELECT id, blank, blank_spec from pdo.details;
	`.execute(db)) as { rows: Detail[] }

	const updates = details.rows
		.filter(d => d.blank?.material)
		.map(d => {
			const [material_id, gross_length] = d.blank!.material as any as number[]
			return db
				.updateTable('pdo.details')
				.set({
					blank: {
						material: {
							material_id,
							data: {
								type: MaterialRequirement.Single,
								gross_length,
								blank_length: 0,
							},
						},
						attributes: d.blank_spec,
					},
				})
				.where('id', '=', d.id)
		})

	const BATCH_SIZE = 100
	for (let i = 0; i < updates.length; i += BATCH_SIZE) {
		await Promise.all(updates.slice(i, i + BATCH_SIZE).map(q => q.execute()))
	}
}

export async function down(db: KDB): Promise<void> {}
