import { db, procedure } from '#root/deps.js'

const FinishedLimit = 10

const query = db
  .selectFrom('metal_flow.manufacturing as m')
  .selectAll('m')
  .innerJoin('metal_flow.details as d', 'm.detail_id', 'd.id')
  .select(['d.name as detail_name', 'd.logical_group_id as group_id'])

export const listManufacturing = procedure.query(async () => {
  const [inProduction, finished] = await Promise.all([
    query
      .where('m.finished_at', 'is', null)
      .orderBy('m.started_at', 'asc')
      .execute(),
    query
      .where('m.finished_at', 'is not', null)
      .orderBy('m.finished_at', 'desc')
      .limit(FinishedLimit)
      .execute()
  ])
  return [
    ...inProduction.map(e => ({
      ...e,
      material_writeoffs: undefined
    })),
    ...finished.map(e => ({
      ...e,
      material_writeoffs: undefined
    }))
  ]
})
