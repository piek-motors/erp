import { OperationSubject } from 'shared'
import type { KDB } from '../schema/index.js'

export async function up(db: KDB): Promise<void> {
  await db.schema
    .alterTable('pdo.operations')
    .addColumn('subject', 'smallint', b =>
      b.notNull().defaultTo(OperationSubject.Material),
    )
    .execute()
}

export async function down(db: KDB): Promise<void> {
  await db.schema.alterTable('pdo.operations').dropColumn('subject').execute()
}
