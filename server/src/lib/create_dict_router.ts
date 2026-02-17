import type { DB, Selectable } from 'db'
import { db, procedure, router, z } from '#root/sdk.js'
import { logger } from '#root/ioc/log.js'

export type DictEntry = Selectable<DB.Dict<string>>

export const create_dict_router = <TE extends keyof DB.Schema & string>(
  table: TE,
  delete_check?: (id: number) => Promise<void>,
) =>
  router({
    ls: procedure.query(
      async (): Promise<{ id: number; v: any }[]> =>
        db.selectFrom(table).selectAll().execute() as Promise<DictEntry[]>,
    ),
    add: procedure
      .input(z.object({ v: z.any() }))
      .mutation(async ({ input }) => {
        const [created] = await db
          .insertInto(table)
          .values({ v: input.v } as any)
          .returningAll()
          .execute()
        return created as Promise<DictEntry>
      }),
    rm: procedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input: { id }, ctx: { user } }) => {
        await delete_check?.(id)
        await db
          .deleteFrom(table)
          .where('id' as any, '=', id)
          .execute()
        logger.info(`Dictionary value ${id} deleted by ${user.full_name}`)
      }),
  })
