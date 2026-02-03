import { log } from 'console'
import type { KDB } from '../schema'

export async function up(db: KDB): Promise<void> {
  // 1. Load all existing operaion names
  const details = await db
    .selectFrom('pdo.details')
    .select(['id', 'processing_route'])
    .execute()

  const operation_names: string[] = details
    .flatMap(d => d.processing_route?.steps)
    .map((opd: any) => {
      if (opd && typeof opd === 'object' && 'name' in opd) {
        return opd['name'] as string
      }
      return ''
    })
    .filter(e => e !== '')

  if (!operation_names.length) {
    throw Error('failed to collect operation names for migration')
  }

  const unique_operations = Array.from(new Set(operation_names))
  log(`finded ${unique_operations.length} different operations`)

  const insert_res = await db
    .insertInto('pdo.dict_operation_kinds')
    .values(unique_operations.map(e => ({ v: e })))
    .returningAll()
    .execute()

  log(`added ${insert_res.length} rows to dict`)
  const operationNameIdMap: Record<string, number> = {}
  insert_res.forEach(each => (operationNameIdMap[each.v] = each.id))

  for (const d of details) {
    if (!d.processing_route) continue

    const steps = d.processing_route?.steps as any as Array<{ name: string }>
    const operations_ids = steps.map(s => operationNameIdMap[s.name])
    await db
      .updateTable('pdo.details')
      .set({
        processing_route: {
          steps: operations_ids,
        },
      })
      .where('id', '=', d.id)
      .execute()
  }
}

export async function down(db: KDB): Promise<void> {
  await db.deleteFrom('pdo.dict_operation_kinds').execute()
}
