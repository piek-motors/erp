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
    const materials = await getMaterialsForDetail(input.detailId)
    const materialsWithStock = await writeOffMaterials(
      materials,
      input.qty,
      ctx.user.id,
      input.detailId
    )

    await db
      .insertInto('metal_flow.manufacturing')
      .values({
        detail_id: input.detailId,
        qty: input.qty,
        finished_at: null,
        material_writeoffs: {
          writeoffs: materialsWithStock.map(m => ({
            material_id: m.material_id,
            total_cost: m.totalCost,
            writeoff_id: m.writeoff_id
          }))
        }
      })
      .execute()

    return materialsWithStock.map(m => ({
      material_id: m.material_id,
      material_name: m.material_name,
      stock: m.stock,
      unit: m.unit,
      totalCost: m.totalCost
    }))
  })

async function writeOffMaterials(
  materials: {
    id: number
    label: string
    stock: number
    data: { length: number }
  }[],
  qty: number,
  user_id: number,
  detail_id: number
) {
  const res: {
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
    const totalCost = (material.data.length * qty) / 1000

    if (material.stock < totalCost) {
      throw new ErrNotEnoughMaterial(
        `Недостаточно материала (id=${id}) ${label}, требуется ${totalCost.toFixed(
          1
        )} м, имеется ${material.stock.toFixed(1)} м`
      )
    }
    if (totalCost === 0) {
      throw new ErrZeroCost(`Не указан расход материала (id=${id}) ${label}`)
    }

    const stock = material.stock - totalCost
    const m = await db
      .updateTable('metal_flow.materials')
      .set({ stock })
      .where('id', '=', material.id)
      .returning(['unit'])
      .executeTakeFirstOrThrow()

    const operation = await db
      .insertInto('metal_flow.operations')
      .values({
        operation_type: EnOperationType.Writeoff,
        reason: EnWriteoffReason.UsedInProduction,
        material_id: material.id,
        user_id,
        detail_id,
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

    res.push({
      material_id: material.id,
      material_name: material.label,
      writeoff_id: operation.id,
      unit: m.unit,
      stock,
      totalCost
    })
  }

  return res
}

const getMaterialsForDetail = async (detailId: number) => {
  return db
    .selectFrom('metal_flow.detail_materials')
    .innerJoin('metal_flow.materials', 'material_id', 'id')
    .where('detail_id', '=', detailId)
    .select(['material_id as id', 'data', 'stock', 'label', 'unit'])
    .execute()
}

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
