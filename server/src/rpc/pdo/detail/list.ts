import { db, procedure } from '#root/deps.js'
import { matrixEncoder } from '#root/lib/matrix_encoder.js'

export interface ListDetailsOutput {
  id: number
  name: string
  part_code: string
  logical_group_id: number | null
  stock: number
}

export const getDetailList = procedure.query(async () => {
  const result = await db
    .selectFrom('pdo.details as d')
    .select(['d.id', 'd.name', 'd.part_code', 'd.logical_group_id', 'd.stock'])
    .orderBy('d.id', 'desc')
    .execute()
  return matrixEncoder(result)
})
