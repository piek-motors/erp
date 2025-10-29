import { db } from '#root/deps.js'
import { publicProcedure } from '#root/lib/trpc/trpc.js'
import { MaterialShape, Unit } from 'models'
import { z } from 'zod'

export const updateMaterial = publicProcedure
  .input(
    z.object({
      id: z.number(),
      label: z.string(),
      shape: z.enum(MaterialShape),
      shape_data: z.any(),
      unit: z.enum(Unit).nullable(),
      // linear_mass: z.number(),
      alloy: z.string().nullable(),
      safety_stock: z.number().nullable()
    })
  )
  .mutation(async ({ input }) => {
    await db
      .updateTable('pdo.materials')
      .set({
        label: input.label,
        shape: input.shape,
        shape_data: input.shape_data,
        unit: input.unit ?? Unit.M,
        // linear_mass: input.linear_mass,
        alloy: input.alloy,
        safety_stock: input.safety_stock ?? 0
      })
      .where('id', '=', input.id)
      .executeTakeFirstOrThrow()
    return 'ok'
  })
