import { cache } from 'domains/metalflow/cache/root'
import { matrixDecoder } from 'lib/matrix_decoder'
import { rpc } from 'lib/rpc.client'
import { makeAutoObservable } from 'mobx'
import { OperationListItem } from 'srv/procedures/metalflow/operations/list'

export type Operation = OperationListItem

class OperationsStore {
  operations: Operation[] = []
  constructor() {
    makeAutoObservable(this)
  }
  setOperations(operations: Operation[]) {
    this.operations = operations
  }
  async revertOperation(id: number) {
    await rpc.metal.operations.revert.mutate({ id })
    this.setOperations(this.operations.filter(op => op.id !== id))
    await cache.materials.load()
    return true
  }
  async load(materialId?: number, detailId?: number) {
    const operationsRaw = await rpc.metal.operations.list.query({
      materialId,
      detailId
    })
    const operations = matrixDecoder<Operation>(operationsRaw)
    this.setOperations(operations)
  }
}
export const store = new OperationsStore()
