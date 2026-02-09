import type { KDB } from '../schema.js'
import { recalculateMaterialLabels } from '../scripts/recalculate-material-labels.js'

export async function up(db: KDB): Promise<void> {
  await recalculateMaterialLabels(db)
}

export async function down(db: KDB): Promise<void> {}
