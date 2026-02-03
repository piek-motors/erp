import { matrixEncoder } from '#root/lib/matrix_encoder.js'
import { formatDate } from '#root/lib/time.js'
import { router } from '#root/lib/trpc/trpc.js'
import { db, procedure, z } from '#root/sdk.js'
import type { DB, Selectable } from 'db'
import { type Unit } from 'models'

const Limit = 100

export type OperationListItem = Omit<
	Selectable<DB.OperationsTable>,
	'timestamp'
> & {
	timestamp: string | null
	detail_name: string | null
	detail_group_id: number | null
	material_label: string | null
	manufacturing_order_id: number | null
	manufacturing_order_qty: number | null
	unit: Unit
}

export const operations = router({
	list: procedure
		.input(
			z.object({
				materialId: z.number().optional(),
				detailId: z.number().optional(),
			}),
		)
		.query(async ({ input }) => {
			const operations = await db
				.selectFrom('pdo.operations as o')
				.$if(!!input.materialId, qb =>
					qb.where('o.material_id', '=', input.materialId as number),
				)
				.$if(!!input.detailId, qb =>
					qb.where('o.detail_id', '=', input.detailId as number),
				)
				.leftJoin('pdo.materials as m', 'o.material_id', 'm.id')
				.leftJoin('pdo.details as d', 'o.detail_id', 'd.id')
				.selectAll(['o'])
				.select('d.name as detail_name')
				.select('d.logical_group_id as detail_group_id')
				.select('m.label as material_label')
				.leftJoin('pdo.orders as manuf', 'manufacturing_order_id', 'manuf.id')
				.select('o.manufacturing_order_id as manufacturing_order_id')
				.select('manuf.qty as manufacturing_order_qty')
				.select('m.unit as unit')
				.orderBy('o.id', 'desc')
				.limit(Limit)
				.execute()

			operations.forEach(operation => {
				operation.timestamp = formatDate(operation.timestamp) as any
			})
			return matrixEncoder(operations)
		}),
})
