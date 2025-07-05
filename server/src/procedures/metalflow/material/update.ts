import { db } from '#root/deps.js'
import { publicProcedure } from '#root/lib/trpc/trpc.js'
import { EnMaterialShape, EnUnit } from 'domain-model'
import { z } from 'zod'

export const updateMaterial = publicProcedure
  .input(
    z.object({
      id: z.number(),
      label: z.string(),
      shape: z.nativeEnum(EnMaterialShape),
      shape_data: z.any(),
      unit: z.nativeEnum(EnUnit),
      linear_mass: z.number()
    })
  )
  .mutation(async ({ input }) => {
    const { id, label, shape, shape_data, unit, linear_mass } = input
    await db
      .updateTable('metal_flow.materials')
      .set({ label, shape, shape_data, unit, linear_mass })
      .where('id', '=', id)
      .executeTakeFirstOrThrow()

    return 'ok'
  })
