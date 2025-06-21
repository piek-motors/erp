import { db, procedure, z } from '../../../deps.ts'

export const deleteMaterial = procedure
  .input(z.object({ id: z.number() }))
  .mutation(async ({ input }) => {
    const { id } = input
    await db.deleteFrom('metal_flow.materials').where('id', '=', id).execute()
    await db
      .deleteFrom('metal_flow.detail_materials')
      .where('material_id', '=', id)
      .execute()

    return {
      success: true
    }
  })
