import { type KDB } from '../schema'

export async function up(db: KDB): Promise<void> {
  const details = await db
    .selectFrom('metal_flow.details')
    .select(['id', 'params'])
    .execute()

  for (const detail of details) {
    if (detail.params && typeof detail.params === 'object') {
      await db
        .updateTable('metal_flow.details')
        .set({
          params: {
            arr: Object.entries(detail.params).map(([key, value]) => ({
              key,
              value
            }))
          }
        })
        .where('id', '=', detail.id)
        .execute()
    }
  }
}

export async function down(db: KDB): Promise<void> {}
