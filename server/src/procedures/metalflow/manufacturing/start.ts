import { db, publicProcedure, TRPCError, z } from '#root/deps.js'
import { EnUnit } from 'domain-model'

export const addDetailIntoManufacturingList = publicProcedure
  .input(
    z.object({
      detailId: z.number(),
      qty: z.number()
    })
  )
  .mutation(async ({ input }) => {
    // select materials from which detail is made
    const materials = await db
      .selectFrom('metal_flow.detail_materials')
      .innerJoin('metal_flow.materials', 'material_id', 'id')
      .where('detail_id', '=', input.detailId)
      .select(['material_id as id', 'data', 'stock', 'label', 'unit'])
      .execute()

    const materialsWithStock = await writeOffMaterials(materials, input.qty)

    await db
      .insertInto('metal_flow.manufacturing')
      .values({
        detail_id: input.detailId,
        qty: input.qty,
        finished_at: null,
        material_writeoffs: {
          writeoffs: materialsWithStock.map(m => ({
            id: m.material_id,
            totalCostKg: m.totalCostKg
          }))
        }
      })
      .execute()

    return materialsWithStock.map(m => ({
      material_id: m.material_id,
      material_name: m.material_name,
      stock: m.stock,
      unit: m.unit,
      totalCostKg: m.totalCostKg
    }))
  })

async function writeOffMaterials(
  materials: {
    id: number
    label: string
    stock: number
    data: { weight: number }
  }[],
  qty: number
) {
  const res: {
    material_id: number
    material_name: string
    unit: EnUnit
    stock: number
    totalCostKg: number
  }[] = []
  // write off materials
  for (const material of materials) {
    const { id, label } = material
    const totalCostGramms = material.data.weight * qty
    const totalCostKg = totalCostGramms / 1000

    if (material.stock < totalCostKg) {
      throw new ErrNotEnoughMaterial(
        `Недостаточно материала (id=${id}) ${label}, требуется ${totalCostKg} кг, имеется ${material.stock} кг`
      )
    }

    if (totalCostKg === 0) {
      throw new ErrZeroCost(`Не указан расход материала (id=${id}) ${label}`)
    }

    const stock = material.stock - totalCostKg
    const m = await db
      .updateTable('metal_flow.materials')
      .set({ stock })
      .where('id', '=', material.id)
      .returning(['unit'])
      .executeTakeFirstOrThrow()

    res.push({
      material_id: material.id,
      material_name: material.label,
      unit: m.unit,
      stock,
      totalCostKg
    })
  }

  return res
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
