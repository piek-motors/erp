import { db } from '#root/deps.js'
import { matrixEncoder } from '#root/lib/matrix_encoder.js'
import { publicProcedure } from '#root/lib/trpc/trpc.js'
import { EnMaterialShape } from 'domain-model'

export interface ListMaterialsOutput {
  id: number
  label: string
  shape: EnMaterialShape
  shape_data: Record<string, unknown>
  unit: string
  stock: number
}

export const listMaterials = publicProcedure.query(async () => {
  const materials = await db
    .selectFrom('metal_flow.materials as m')
    .select(['m.id', 'm.label', 'm.shape', 'm.shape_data', 'm.unit', 'm.stock'])
    .orderBy('m.label')
    .execute()
  return matrixEncoder(materials)
})
