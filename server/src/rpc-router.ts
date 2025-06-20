import { procedure } from './deps.ts'
import { db } from './lib/db.ts'
import { router } from './lib/trpc/trpc.ts'
import { deleteFile } from './procedures/attachment/delete-file.rpc.ts'
import { detailRouter } from './procedures/metalflow/detail/router.ts'
import { materialRouter } from './procedures/metalflow/material/router.ts'

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
