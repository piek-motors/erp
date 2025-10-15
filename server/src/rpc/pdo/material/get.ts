import { db } from '#root/deps.js'
import { publicProcedure } from '#root/lib/trpc/trpc.js'
import { DB } from 'db'
import { Kysely, sql } from 'kysely'
import { z } from 'zod'

export type SelectableMaterial = Kysely<DB.MaterialTable>

export const getMaterial = publicProcedure
  .input(z.object({ id: z.number() }))
  .query(async ({ input }) => {
    const material = await db
      .selectFrom('pdo.materials')
      .selectAll()
      .where('id', '=', input.id)
      .executeTakeFirstOrThrow()

    const detailCount = await db
      .selectFrom('pdo.details')
      .where(
        sql<boolean>`(automatic_writeoff->'material'->>'material_id')::int = ${input.id}`
      )
      .select(eb => eb.fn.countAll().as('count'))
      .executeTakeFirstOrThrow()

    return { material, detailCount: Number(detailCount.count) }
  })
