import { db, publicProcedure } from '#root/deps.js'

export const manufacturingList = publicProcedure.query(async () => {
  return await db
    .selectFrom('metal_flow.manufacturing')
    .selectAll()
    .where('finished_at', 'is', null)
    .orderBy('started_at', 'desc')
    .execute()
})
