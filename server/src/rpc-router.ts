import { EnMaterialShape, EnUnit } from 'domain-model'
import { procedure, z } from './deps.ts'
import { db } from './lib/db.ts'
import { router } from './lib/trpc/trpc.ts'
import { deleteFile } from './procedures/attachment/delete-file.rpc.ts'
import { detailRouter } from './procedures/metalflow/detail/router.ts'

const materialRouter = router({
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
    })
})

export const rpcRouter = router({
  material: materialRouter,
  details: detailRouter,
  userList: procedure.query(async () => {
    return await db
      .selectFrom('users')
      .select(['id', 'first_name', 'last_name', 'role'])
      .execute()
  }),
  deleteFile
})
