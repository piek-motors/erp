import { db, procedure } from '#root/deps.js'

export const listDetailGroups = procedure.query(async () => {
  const result = await db
    .selectFrom('pdo.detail_group')
    .selectAll()
    .orderBy('name', 'asc')
    .execute()

  return result
})
