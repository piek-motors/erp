import { EnMaterialShape, EnUnit } from 'domain-model'
import { db, procedure, z } from '../../../deps.ts'
import { router } from '../../../lib/trpc/trpc.ts'
import { listMaterialsProcedure } from './list_materials.ts'

export const materialRouter = router({
  get: procedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return await db
        .selectFrom('metal_flow.materials')
        .selectAll()
        .where('id', '=', input.id)
        .executeTakeFirstOrThrow()
    }),
  insert: procedure
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
    }),
  list: listMaterialsProcedure
})
