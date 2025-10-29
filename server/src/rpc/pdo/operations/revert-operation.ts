import { db, procedure, z } from '#root/deps.js'
import { OperationType } from 'models'

interface StockUpdate {
  table: 'pdo.materials' | 'pdo.details'
  id: number
  quantity: number
  isSupply: boolean
}

export const revertOperation = procedure
  .input(
    z.object({
      id: z.number()
    })
  )
  .mutation(async ({ ctx, input }) => {
    const operation = await getOperation(input.id)
    const stockUpdates = buildStockUpdates(operation)

    await updateStockLevels(stockUpdates)
    await deleteOperation(input.id)

    return {
      success: true,
      message: `Operation ${input.id} reverted successfully`
    }
  })

type Operation = Awaited<ReturnType<typeof getOperation>>
async function getOperation(id: number) {
  const operation = await db
    .selectFrom('pdo.operations')
    .where('id', '=', id)
    .selectAll()
    .executeTakeFirst()

  if (!operation) {
    throw new Error('Operation not found')
  }

  return operation
}

function buildStockUpdates(operation: Operation): StockUpdate[] {
  const updates: StockUpdate[] = []
  const isSupply = Number(operation.operation_type) === OperationType.Supply

  // Add material stock update if operation affects materials
  if (operation.material_id) {
    updates.push({
      table: 'pdo.materials',
      id: operation.material_id,
      quantity: operation.qty!,
      isSupply
    })
  }

  // Add detail stock update if operation affects details
  if (operation.detail_id) {
    updates.push({
      table: 'pdo.details',
      id: operation.detail_id,
      quantity: operation.qty!,
      isSupply
    })
  }

  return updates
}

async function updateStockLevels(updates: StockUpdate[]) {
  for (const update of updates) {
    const stockChange = update.isSupply ? -update.quantity : update.quantity

    await db
      .updateTable(update.table)
      .set(eb => ({
        stock: eb('stock', '+', stockChange)
      }))
      .where('id', '=', update.id)
      .execute()
  }
}

async function deleteOperation(id: number) {
  await db.deleteFrom('pdo.operations').where('id', '=', id).execute()
}
