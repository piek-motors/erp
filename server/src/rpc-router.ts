import { deleteFile } from './attachment/delete-file.rpc.ts'
import { procedure } from './deps.ts'
import { db } from './lib/db.ts'
import { router } from './lib/trpc/trpc.ts'

export const rpcRouter = router({
  userList: procedure.query(async () => {
    return await db
      .selectFrom('users')
      .select(['id', 'first_name', 'last_name', 'role'])
      .execute()
  }),
  deleteFile
})
