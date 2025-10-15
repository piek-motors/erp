import { db, TRPCError } from '#root/deps.js'
import { publicProcedure } from '#root/lib/trpc/trpc.js'
import { DB } from 'db'
import { Selectable } from 'kysely'
import { z } from 'zod'

export type SelectableDetail = Selectable<DB.DetailTable>
export type DetailAutomaticWriteoffData = DB.DetailAutomaticWriteoffData

export const getDetail = publicProcedure
  .input(
    z.object({
      id: z.number()
    })
  )
  .query(async ({ input }) => {
    const [detail, attachments, lastManufacturing] = await Promise.all([
      db
        .selectFrom('pdo.details')
        .where('id', '=', input.id)
        .selectAll()
        .executeTakeFirstOrThrow()
        .catch(err => {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: err.message
          })
        }),
      db
        .selectFrom('pdo.detail_attachments')
        .leftJoin('attachments', join => join.onRef('attachment_id', '=', 'id'))
        .where('detail_id', '=', input.id)
        .selectAll()
        .execute(),
      db
        .selectFrom('pdo.manufacturing')
        .select(['finished_at', 'qty'])
        .where('detail_id', '=', input.id)
        .where('finished_at', 'is not', null)
        .orderBy('finished_at', 'desc')
        .limit(1)
        .executeTakeFirst()
    ])
    return {
      detail,
      attachments,
      last_manufacturing: lastManufacturing
        ? {
            date: lastManufacturing.finished_at,
            qty: lastManufacturing.qty
          }
        : null
    }
  })
