import { db, publicProcedure } from '#root/deps.js'

export const manufacturingList = publicProcedure.query(async () => {
  const inProduction = await db
    .selectFrom('metal_flow.manufacturing')
    .selectAll()
    .where('finished_at', 'is', null)
    .orderBy('started_at', 'desc')
    .execute()

  const finished = await db
    .selectFrom('metal_flow.manufacturing')
    .selectAll()
    .where('finished_at', 'is not', null)
    .orderBy('finished_at', 'desc')
    .limit(50)
    .execute()

  return {
    inProduction,
    finished
  }
})
