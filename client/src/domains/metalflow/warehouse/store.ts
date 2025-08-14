import { cache } from 'domains/metalflow/cache/root'
import { rpc } from 'lib/rpc.client'
import { makeAutoObservable } from 'mobx'
import { RouterOutput } from 'srv/lib/trpc'

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
    this.setOperations(this.operations.filter(op => op.id !== id))
    await cache.materials.load()
    return true
  }
  async load(materialId?: number, detailId?: number) {
    const operations = await rpc.metal.operations.list.query({
      materialId,
      detailId
    })
    console.log(operations)
    this.setOperations(operations)
  }
}
export const store = new OperationsStore()
