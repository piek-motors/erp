import { db } from '#root/deps.js'
import { matrixEncoder } from '#root/lib/matrix_encoder.js'
import { publicProcedure } from '#root/lib/trpc/trpc.js'
import { DB } from 'db'

export type Material = DB.Material

export const listMaterials = publicProcedure.query(async () => {
  const materials = await db
    .selectFrom('metal_flow.materials as m')
    .selectAll()
    .orderBy('m.label')
    .execute()

  return matrixEncoder(materials)
})
