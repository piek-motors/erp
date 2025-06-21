import { EnMaterialShape, EnUnit } from 'domain-model'
import { db, z } from '../../../deps.ts'
import { publicProcedure } from '../../../lib/trpc/trpc.ts'

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
    return await db
      .insertInto('metal_flow.materials')
      .values(input)
      .returningAll()
      .executeTakeFirstOrThrow()
  })
