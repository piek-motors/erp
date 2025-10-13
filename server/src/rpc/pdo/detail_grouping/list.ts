import { db, procedure } from '#root/deps.js'

export const listDetailGroups = procedure.query(async () => {
  const result = await db
    .selectFrom('metal_flow.detail_group')
    .selectAll()
    .orderBy('name', 'asc')
    .execute()

  return result
})
