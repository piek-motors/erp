import { db, procedure } from '#root/deps.js'

const query = db
  .selectFrom('metal_flow.manufacturing as m')
  .selectAll('m')
  .innerJoin('metal_flow.details as d', 'm.detail_id', 'd.id')
  .select(['d.name as detail_name', 'd.logical_group_id as group_id'])

export const listManufacturing = procedure.query(async () => {
  const [inProduction, finished] = await Promise.all([
    query
      .where('m.finished_at', 'is', null)
      .orderBy('m.status', 'asc')
      .execute(),
    query.where('m.finished_at', 'is not', null).limit(50).execute()
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
