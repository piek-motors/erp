import { createHTTPServer } from '@trpc/server/adapters/standalone'
import cors from 'cors'
import z from 'zod'
import { config } from '../config.ts'
import { db } from '../lib/db.ts'
import { createContext } from './context.ts'
import { publicProcedure, router } from './trpc.ts'

const appRouter = router({
  userList: publicProcedure.query(async () => {
    return await db.selectFrom('users').selectAll().execute()
  }),
  deleteFile: publicProcedure
    .input(
      z.object({
        key: z.string(),
        type: z.enum(['order', 'detail'])
      })
    )
    .mutation(async ({ input }) => {
      console.log('delete file', input)

      return 'ok'
    })
})

export type AppRouter = typeof appRouter

const server = createHTTPServer({
  middleware: cors(),
  createContext,
  router: appRouter
})

server.listen(config.PORT + 1, () => {
  console.log('TRPC server running on port', config.PORT + 1)
})
