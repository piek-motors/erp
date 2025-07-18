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
      linear_mass: z.number(),
      alloy: z.string().nullable()
    })
  )
  .mutation(async ({ input }) => {
    await db
      .updateTable('metal_flow.materials')
      .set({
        label: input.label,
        shape: input.shape,
        shape_data: input.shape_data,
        unit: input.unit,
        linear_mass: input.linear_mass,
        alloy: input.alloy
      })
      .where('id', '=', input.id)
      .executeTakeFirstOrThrow()
    return 'ok'
  })
