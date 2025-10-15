import { db, publicProcedure, z } from '#root/deps.js'
import { matrixEncoder } from '#root/lib/matrix_encoder.js'
import { formatDate } from '#root/lib/time.js'
import type { DB, Selectable } from 'db'

const Limit = 300

export interface OperationListItem
  extends Omit<Selectable<DB.OperationsTable>, 'timestamp'> {
  timestamp: string | null
  detail_name: string | null
  detail_group_id: number | null
  material_label: string | null
  manufacturing_order_id: number | null
  manufacturing_order_qty: number | null
}

export const listOperations = publicProcedure
  .input(
    z.object({
      materialId: z.number().optional(),
      detailId: z.number().optional()
    })
  )
  .query(async ({ ctx, input }) => {
    const operations = await db
      .selectFrom('pdo.operations as o')
      .$if(input.materialId != null, qb =>
        qb.where('o.material_id', '=', input.materialId!)
      )
      .$if(input.detailId != null, qb =>
        qb.where('o.detail_id', '=', input.detailId!)
      )
      .leftJoin('pdo.materials as m', 'o.material_id', 'm.id')
      .leftJoin('pdo.details as d', 'o.detail_id', 'd.id')
      .selectAll(['o'])
      .select('d.name as detail_name')
      .select('d.logical_group_id as detail_group_id')
      .select('m.label as material_label')
      .leftJoin(
        'pdo.manufacturing as manuf',
        'manufacturing_order_id',
        'manuf.id'
      )
      .select('o.manufacturing_order_id as manufacturing_order_id')
      .select('manuf.qty as manufacturing_order_qty')
      .orderBy('o.id', 'desc')
      .limit(Limit)
      .execute()

    operations.forEach(operation => {
      operation.timestamp = formatDate(operation.timestamp) as any
    })

    return matrixEncoder(operations)
  })
