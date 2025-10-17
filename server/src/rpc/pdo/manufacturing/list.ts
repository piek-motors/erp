import { db, procedure } from '#root/deps.js'
import { Day } from '#root/lib/constants.js'
import { matrixEncoder } from '#root/lib/matrix_encoder.js'
import { formatDate, timedeltaInSeconds } from '#root/lib/time.js'
import { EnManufacturingOrderStatus } from 'models'

const ShowFinishedOrders = 14 * Day

export interface ListManufacturingOutput {
  id: number
  detail_id: number
  detail_name: string
  qty: number
  group_id: number | null
  status: EnManufacturingOrderStatus
  created_at: string
  started_at: string | null
  finished_at: string | null
  time_delta: number | null
}

const query = db
  .selectFrom('pdo.manufacturing as m')
  .select([
    'm.id',
    'm.status',
    'm.detail_id',
    'm.qty',
    'm.finished_at',
    'm.created_at',
    'm.started_at'
  ])
  .innerJoin('pdo.details as d', 'm.detail_id', 'd.id')
  .select(['d.name as detail_name', 'd.logical_group_id as group_id'])

export const listManufacturing = procedure.query(async () => {
  const cutoffDate = new Date(Date.now() - ShowFinishedOrders)
  const [inProduction, finished] = await Promise.all([
    query
      .where('m.finished_at', 'is', null)
      .where('m.status', '!=', EnManufacturingOrderStatus.Collected)
      .orderBy('m.created_at', 'desc')
      .execute(),
    query
      .where('m.finished_at', '>=', cutoffDate)
      .orderBy('m.finished_at', 'desc')
      .execute()
  ])
  const result = [...inProduction, ...finished].map(o => ({
    ...o,
    created_at: formatDate(o.created_at),
    started_at: formatDate(o.started_at),
    finished_at: formatDate(o.finished_at),
    time_delta:
      o.finished_at && o.started_at
        ? timedeltaInSeconds(o.finished_at, o.started_at)
        : null
  }))

  return matrixEncoder(result)
})
