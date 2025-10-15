import { type KDB } from '../schema'

export async function up(db: KDB): Promise<void> {
  const details = await db
    .selectFrom('pdo.details')
    .select(['id', 'blank_spec'])
    .execute()

  for (const detail of details) {
    if (detail.blank_spec && typeof detail.blank_spec === 'object') {
      await db
        .updateTable('pdo.details')
        .set({
          blank_spec: {
            arr: Object.entries(detail.blank_spec).map(([key, value]) => ({
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
