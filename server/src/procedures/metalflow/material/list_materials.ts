import { db, procedure } from '../../../deps.ts'

export const listMaterialsProcedure = procedure.query(async ({ input }) => {
  const material = await db
    .selectFrom('metal_flow.materials')
    .selectAll()
    .execute()
  return material
})
