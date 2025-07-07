import { rpc } from 'lib/rpc.client'
import { cache } from 'metalflow/metal_flow_cache'
import { makeAutoObservable } from 'mobx'
import { RouterOutput } from '../../../../server/src/lib/trpc'

export type Operation = RouterOutput['metal']['operations']['list'][number]

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
    this.setOperations(this.operations.filter(op => op.operation_id !== id))
    await cache.materials.load()
    return true
  }
  async load() {
    const operations = await rpc.metal.operations.list.query({})
    this.setOperations(operations)
  }
}
export const store = new OperationsStore()
