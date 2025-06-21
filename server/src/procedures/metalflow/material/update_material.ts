import { EnMaterialShape, EnUnit } from 'domain-model'
import { z } from 'zod'
import { db } from '../../../deps.ts'
import { publicProcedure } from '../../../lib/trpc/trpc.ts'

export const updateMaterial = publicProcedure
  .input(
    z.object({
      id: z.number(),
      label: z.string(),
      shape: z.nativeEnum(EnMaterialShape),
      shape_data: z.any(),
      unit: z.nativeEnum(EnUnit)
    })
  )
  .mutation(async ({ input }) => {
    const { id, label, shape, shape_data, unit } = input
    const material = await db
      .updateTable('metal_flow.materials')
      .set({ label, shape, shape_data, unit })
      .where('id', '=', id)
      .execute()
    return material
  })
