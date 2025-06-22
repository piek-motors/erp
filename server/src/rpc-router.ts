import { db } from '#root/lib/db.js'
import { publicProcedure, router } from '#root/lib/trpc/trpc.js'
import { deleteFile } from '#root/procedures/attachment/delete-file.rpc.js'
import { detailRouter } from '#root/procedures/metalflow/detail/router.js'
import { materialRouter } from '#root/procedures/metalflow/material/router.js'

export const rpcRouter = router({
  material: materialRouter,
  details: detailRouter,
  userList: publicProcedure.query(async () => {
    return await db
      .selectFrom('users')
      .select(['id', 'first_name', 'last_name', 'role'])
      .execute()
  }),
  deleteFile
})
