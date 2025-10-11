export { config } from '#root/env.js'
export { db } from '#root/ioc/db.js'
export { s3 } from '#root/ioc/s3.js'
export {
  publicProcedure as procedure,
  publicProcedure,
  router
} from '#root/lib/trpc/trpc.js'
export { TRPCError } from '@trpc/server'
export { sql, type Kysely } from 'kysely'
export { z } from 'zod'

import { db } from '#root/ioc/db.js'
export type IDB = typeof db
