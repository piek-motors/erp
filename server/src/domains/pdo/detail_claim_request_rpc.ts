import { z } from 'zod'
import { matrixEncoder } from '#root/lib/matrix_encoder.js'
import { db, procedure, requireScope, router, Scope } from '#root/sdk.js'
import { DetailClaimRequestRepo } from './storage/detail_claim_request_repo.js'

const repo = new DetailClaimRequestRepo(db)

const RequestDetailSchema = z.object({
  detail_id: z.number(),
  qty: z.number().gt(0),
})

const RequestInputSchema = z.object({
  order_id: z.string().trim().nonempty(),
  product_name: z.string().trim().nonempty(),
  product_qty: z.number().gt(0),
  details: z
    .array(RequestDetailSchema)
    .refine(
      details => new Set(details.map(d => d.detail_id)).size === details.length,
      'Детали в заявке не должны повторяться',
    ),
})

export const detail_claim_requests = router({
  list: procedure.query(async () => matrixEncoder(await repo.list())),

  get: procedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input: { id } }) => repo.get(id)),

  create: procedure
    .use(requireScope(Scope.pdo))
    .input(RequestInputSchema)
    .mutation(async ({ input }) => repo.create(input)),

  update: procedure
    .use(requireScope(Scope.pdo))
    .input(RequestInputSchema.extend({ id: z.number() }))
    .mutation(async ({ input }) => repo.update(input)),

  fulfill: procedure
    .use(requireScope(Scope.pdo))
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input: { id }, ctx }) => repo.fulfill(id, ctx.user.id)),

  delete: procedure
    .use(requireScope(Scope.pdo))
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input: { id } }) => repo.delete(id)),
})
