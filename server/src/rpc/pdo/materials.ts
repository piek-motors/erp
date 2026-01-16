import {
  db,
  matrixEncoder,
  procedure,
  requireScope,
  Scope,
  TRPCError
} from '#root/deps.js'
import { materials_stat_container } from '#root/ioc/index.js'
import { logger } from '#root/ioc/log.js'
import { isDuplicateKeyError } from '#root/lib/kysely.js'
import { router } from '#root/lib/trpc/trpc.js'
import { Warehouse } from '#root/service/warehouse.service.js'
import { info } from 'console'
import { DB } from 'db'
import { sql } from 'kysely'
import {
  MaterialConstructorMap,
  MaterialShape,
  MaterialShapeAbstractionLayer,
  SupplyReason,
  Unit,
  WriteoffReason
} from 'models'
import { z } from 'zod'

export type Material = DB.Material & {}

export const material = router({
  get: procedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const [material, detailCount] = await Promise.all([
        db
          .selectFrom('pdo.materials')
          .selectAll()
          .where('id', '=', input.id)
          .executeTakeFirstOrThrow(),
        db
          .selectFrom('pdo.details')
          .where(
            sql<boolean>`(automatic_writeoff->'material'->>0)::int = ${input.id}`
          )
          .select(eb => eb.fn.countAll().as('count'))
          .executeTakeFirstOrThrow()
      ])
      return {
        material,
        detailCount: Number(detailCount.count),
        writeoff_stat: {
          monthly: materials_stat_container.writeoffs.monthly?.get(input.id)
            ?.entries,
          quarterly: materials_stat_container.writeoffs.quarterly?.get(input.id)
            ?.entries
        }
      }
    }),
  //
  list: procedure.query(() =>
    db
      .selectFrom('pdo.materials as m')
      .selectAll()
      .orderBy('m.label')
      .execute()
      .then(materials => matrixEncoder(materials))
  ),
  //
  create: procedure
    .use(requireScope(Scope.pdo))
    .input(
      z.object({
        unit: z.enum(Unit).nullable(),
        shape: z.enum(MaterialShape),
        label: z.string().nonempty(),
        shape_data: z.any(),
        // linear_mass: z.number(),
        alloy: z.string().nullable()
      })
    )
    .mutation(async ({ input }) => {
      const constructor = MaterialConstructorMap[input.shape]
      const materialModel = new constructor(input.shape_data, '', input.alloy)
      MaterialShapeAbstractionLayer.importShapeData(
        materialModel,
        input.shape_data
      )
      const label = materialModel.deriveLabel()
      const material = await db
        .insertInto('pdo.materials')
        .values({
          ...input,
          unit: input.unit ?? Unit.M,
          label,
          stock: 0,
          linear_mass: 0,
          alloy: input.alloy,
          safety_stock: 0
        })
        .returningAll()
        .executeTakeFirstOrThrow()
        .catch(e => {
          if (isDuplicateKeyError(e)) {
            throw new TRPCError({
              code: 'CONFLICT',
              message: 'Материал с таким названием уже существует'
            })
          }
          throw e
        })
      info(`New material created: ${label}`)
      return material
    }),
  //
  delete: procedure
    .use(requireScope(Scope.pdo))
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const { id } = input
      await db.transaction().execute(async trx => {
        await trx
          .deleteFrom('pdo.operations')
          .where('material_id', '=', id)
          .execute()
        const { label } = await trx
          .deleteFrom('pdo.materials')
          .where('id', '=', id)
          .returning(['label'])
          .executeTakeFirstOrThrow()
        logger.warn(`Material deleted: ${id} ${label}`)
      })
      return {
        success: true
      }
    }),
  update: procedure
    .use(requireScope(Scope.pdo))
    .input(
      z.object({
        id: z.number(),
        label: z.string(),
        shape: z.enum(MaterialShape),
        shape_data: z.any(),
        unit: z.enum(Unit).nullable(),
        // linear_mass: z.number(),
        alloy: z.string().nullable(),
        safety_stock: z.number().nullable()
      })
    )
    .mutation(async ({ input }) => {
      await db
        .updateTable('pdo.materials')
        .set({
          label: input.label,
          shape: input.shape,
          shape_data: input.shape_data,
          unit: input.unit ?? Unit.M,
          // linear_mass: input.linear_mass,
          alloy: input.alloy,
          safety_stock: input.safety_stock ?? 0
        })
        .where('id', '=', input.id)
        .executeTakeFirstOrThrow()
      return 'ok'
    }),
  //
  supply: procedure
    .use(requireScope(Scope.pdo))
    .input(
      z.object({
        material_id: z.number(),
        lengthMeters: z.number().gt(0),
        reason: z.nativeEnum(SupplyReason)
      })
    )
    .mutation(({ input, ctx }) =>
      db.transaction().execute(async trx =>
        new Warehouse(trx, ctx.user.id)
          .supplyMaterial(input.material_id, input.lengthMeters, input.reason)
          .then(({ stock }) => ({
            qty: stock.toString()
          }))
      )
    ),
  //
  writeoff: procedure
    .use(requireScope(Scope.pdo))
    .input(
      z.object({
        material_id: z.number(),
        lengthMeters: z.number().gt(0),
        reason: z.enum(WriteoffReason),
        type_data: z.any()
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await db.transaction().execute(async trx => {
        const warehouse = new Warehouse(trx, ctx.user.id)
        const result = await warehouse.subtractMaterial(
          input.material_id,
          input.lengthMeters,
          input.reason
        )
        return result.stock.toString()
      })
    }),
  //
  dict_distinct_alloys: procedure.query(async () =>
    db
      .selectFrom('pdo.materials')
      .select('alloy')
      .distinct()
      .execute()
      .then(res => res.map(e => e.alloy))
  )
})
