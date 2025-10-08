import { db, publicProcedure, z } from '#root/deps.js'
import { matrixEncoder } from '#root/lib/matrix_encoder.js'

export interface ListDetailsOutput {
  id: number
  name: string
  part_code: string
  logical_group_id: number | null
  stock: number
}

export const getDetailList = publicProcedure
  .input(
    z.object({
      onlyUniversalDetails: z.boolean().optional()
    })
  )
  .query(async ({ input }) => {
    const result = await db
      .selectFrom('metal_flow.details as d')
      .$if(input.onlyUniversalDetails === true, qb =>
        qb.where('d.logical_group_id', 'is', null)
      )
      .select([
        'd.id',
        'd.name',
        'd.part_code',
        'd.logical_group_id',
        'd.stock'
      ])
      .orderBy('d.id', 'desc')
      .execute()
    return matrixEncoder(result)
  })
