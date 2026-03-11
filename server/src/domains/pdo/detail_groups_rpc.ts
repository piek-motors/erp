import { z } from 'zod'
import { matrixEncoder } from '#root/lib/matrix_encoder.js'
import { router } from '#root/lib/trpc/trpc.js'
import { db, procedure, requireScope, Scope, TRPCError } from '#root/sdk.js'
import { create_detail_group_map } from './utils.js'

export interface DetailInTheGroup {
  id: number
  name: string
  drawing_number: string | null
  group_ids: number[]
}

export const detail_groups = router({
  get: procedure
    .input(
      z.object({
        groupId: z.number(),
      }),
    )
    .query(async ({ input }) => {
      const [group, detailsInGroup, allGroupDetails] = await Promise.all([
        db
          .selectFrom('pdo.detail_group')
          .where('id', '=', input.groupId)
          .select(['id', 'name'])
          .executeTakeFirst(),
        db
          .selectFrom('pdo.detail_group_details as dgd')
          .where('dgd.group_id', '=', input.groupId)
          .leftJoin('pdo.details as d', 'd.id', 'dgd.detail_id')
          .select(['d.id', 'd.name', 'd.drawing_number'])
          .orderBy('d.name', 'asc')
          .execute(),
        db
          .selectFrom('pdo.detail_group_details')
          .select(['detail_id', 'group_id'])
          .execute(),
      ])
      if (!group) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Detail group not found',
        })
      }
      const detail_group_map = create_detail_group_map(allGroupDetails)
      const detailsData: DetailInTheGroup[] = detailsInGroup.map(d => ({
        id: d.id as number,
        name: d.name as string,
        drawing_number: d.drawing_number as string | null,
        group_ids: detail_group_map.get(d.id as number) || [],
      }))
      return {
        group,
        details: matrixEncoder(detailsData),
      }
    }),
  //
  list: procedure.query(async () =>
    db
      .selectFrom('pdo.detail_group')
      .selectAll()
      .orderBy('name', 'asc')
      .execute(),
  ),
  //
  create: procedure
    .use(requireScope(Scope.pdo))
    .input(
      z.object({
        name: z
          .string()
          .min(3, 'Название группы должно быть не менее 3 символов'),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const result = await db
          .insertInto('pdo.detail_group')
          .values({
            name: input.name,
          })
          .returning(['id', 'name'])
          .executeTakeFirstOrThrow()

        return result
      } catch (error: any) {
        if (error.code === '23505') {
          // Unique constraint violation
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'A detail group with this name already exists',
          })
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create detail group',
        })
      }
    }),
  //
  update: procedure
    .use(requireScope(Scope.pdo))
    .input(
      z.object({
        id: z.number(),
        name: z
          .string()
          .min(3, 'Название группы должно быть не менее 3 символов'),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const result = await db
          .updateTable('pdo.detail_group')
          .set({
            name: input.name,
          })
          .where('id', '=', input.id)
          .returning(['id', 'name'])
          .executeTakeFirst()
        if (!result) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Detail group not found',
          })
        }
        return result
      } catch (error: any) {
        if (error.code === '23505') {
          // Unique constraint violation
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'A detail group with this name already exists',
          })
        }
        if (error instanceof TRPCError) {
          throw error
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update detail group',
        })
      }
    }),
})
