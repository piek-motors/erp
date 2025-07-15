import { db, publicProcedure, TRPCError, z } from '#root/deps.js'
import { EnOperationType, EnUnit, EnWriteoffReason } from 'domain-model'

export const addDetailIntoManufacturingList = publicProcedure
  .input(
    z.object({
      detailId: z.number(),
      qty: z.number()
    })
  )
  .mutation(async ({ input, ctx }) => {
    return await db.transaction().execute(async trx => {
      const materials = await trx
        .selectFrom('metal_flow.detail_materials')
        .innerJoin('metal_flow.materials', 'material_id', 'id')
        .where('detail_id', '=', input.detailId)
        .select(['material_id as id', 'data', 'stock', 'label', 'unit'])
        .execute()

      const buffer: {
        material_id: number
        material_name: string
        unit: EnUnit
        stock: number
        totalCost: number
        writeoff_id: number
      }[] = []

      // write off materials
      for (const material of materials) {
        const { id, label } = material
        const totalCost = (material.data.length * input.qty) / 1000

        if (material.stock < totalCost) {
          throw new ErrNotEnoughMaterial(
            `Недостаточно материала (id=${id}) ${label}, требуется ${totalCost.toFixed(
              1
            )} м, имеется ${material.stock.toFixed(1)} м`
          )
        }
        if (totalCost === 0) {
          throw new ErrZeroCost(
            `Не указан расход материала (id=${id}) ${label}`
          )
        }

        const stock = material.stock - totalCost
        const m = await trx
          .updateTable('metal_flow.materials')
          .set({ stock })
          .where('id', '=', material.id)
          .returning(['unit'])
          .executeTakeFirstOrThrow()

        const operation = await trx
          .insertInto('metal_flow.operations')
          .values({
            operation_type: EnOperationType.Writeoff,
            reason: EnWriteoffReason.UsedInProduction,
            material_id: material.id,
            user_id: ctx.user.id,
            detail_id: input.detailId,
            qty: totalCost
          })
          .returning('id')
          .executeTakeFirst()

        if (!operation?.id) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to write off material'
          })
        }

        buffer.push({
          material_id: material.id,
          material_name: material.label,
          writeoff_id: operation.id,
          unit: m.unit,
          stock,
          totalCost
        })
      }

      await trx
        .insertInto('metal_flow.manufacturing')
        .values({
          detail_id: input.detailId,
          qty: input.qty,
          finished_at: null,
          material_writeoffs: {
            writeoffs: buffer.map(m => ({
              material_id: m.material_id,
              total_cost: m.totalCost,
              writeoff_id: m.writeoff_id
            }))
          }
        })
        .execute()

      return buffer.map(m => ({
        material_id: m.material_id,
        material_name: m.material_name,
        stock: m.stock,
        unit: m.unit,
        totalCost: m.totalCost
      }))
    })
  })

class ErrNotEnoughMaterial extends TRPCError {
  constructor(message: string) {
    super({
      code: 'BAD_REQUEST',
      message
    })
  }
}

class ErrZeroCost extends TRPCError {
  constructor(message: string) {
    super({
      code: 'BAD_REQUEST',
      message
    })
  }
}
