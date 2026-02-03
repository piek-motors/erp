import type { KDB } from '../schema'
import { recalculateMaterialLabels } from '../scripts/recalculate-material-labels'

export async function up(db: KDB): Promise<void> {
  await recalculateMaterialLabels(db)
}

export async function down(db: KDB): Promise<void> {}
