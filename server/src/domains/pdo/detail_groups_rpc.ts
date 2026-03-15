import { z } from 'zod'
import { matrixEncoder } from '#root/lib/matrix_encoder.js'
import { router } from '#root/lib/trpc/trpc.js'
import { db, procedure, requireScope, Scope } from '#root/sdk.js'
import {
  DetailGroupRepo,
  type DetailInTheGroup,
} from './storage/detail_group_repo.js'

const repo = new DetailGroupRepo(db)

export const detail_groups = router({
  get: procedure
    .input(z.object({ groupId: z.number() }))
    .query(async ({ input }) => {
      const { group, details } = await repo.get_group_with_details(
        input.groupId,
      )

      return {
        group,
        details: matrixEncoder<DetailInTheGroup>(details),
      }
    }),
  list: procedure.query(async () => repo.list_groups()),
  list_tree: procedure.query(async () => repo.list_tree()),
  create: procedure
    .use(requireScope(Scope.pdo))
    .input(
      z.object({
        name: z.string().nonempty(),
        parent_id: z.number().nullish(),
      }),
    )
    .mutation(async ({ input }) => repo.create(input)),
  update: procedure
    .use(requireScope(Scope.pdo))
    .input(
      z.object({
        id: z.number(),
        name: z.string().nonempty(),
        parent_id: z.number().nullish(),
      }),
    )
    .mutation(async ({ input }) => repo.update(input)),
})
