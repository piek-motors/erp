import { db } from '#root/deps.js'
import { publicProcedure } from '#root/lib/trpc/trpc.js'
import { EnMaterialShape, EnUnit } from 'domain-model'
import { z } from 'zod'

export const createMaterial = publicProcedure
  .input(
    z.object({
      unit: z.nativeEnum(EnUnit),
      shape: z.nativeEnum(EnMaterialShape),
      label: z.string().nonempty(),
      shape_data: z.any()
    })
  )
  .mutation(async ({ input }) => {
    const material = await db
      .insertInto('metal_flow.materials')
      .values({ ...input, stock: 0 })
      .returningAll()
      .executeTakeFirstOrThrow()

    return material
  })
