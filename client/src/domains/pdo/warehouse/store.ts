import { matrixDecoder } from 'lib/rpc/matrix_decoder'
import { rpc } from 'lib/rpc/rpc.client'
import { makeAutoObservable } from 'mobx'
import { OperationListItem } from 'srv/rpc/pdo/operations/list'

export type Operation = OperationListItem

class OperationsStore {
  operations: Operation[] = []
  constructor() {
    makeAutoObservable(this)
  }
  setOperations(operations: Operation[]) {
    this.operations = operations
  }
  async load(materialId?: number, detailId?: number) {
    const operationsRaw = await rpc.pdo.operations.list.query({
      materialId,
      detailId
    })
    const operations = matrixDecoder<Operation>(operationsRaw)
    this.setOperations(operations)
  }
}
export const s = new OperationsStore()
