import { AsyncStoreController } from 'lib/async-store.controller'
import { rpc } from 'lib/deps'
import { makeAutoObservable } from 'mobx'
import { RouterOutput } from 'srv/lib/trpc'

export type ManufactoringListOutput =
  RouterOutput['metal']['manufacturing']['list'][number]

export class ManufacturingListStore {
  readonly async = new AsyncStoreController()

  orders: ManufactoringListOutput[] = []
  setOrders(orders: ManufactoringListOutput[]) {
    this.orders = orders
  }

  constructor() {
    makeAutoObservable(this)
  }

  async load() {
    this.async.run(async () => {
      const orders = await rpc.metal.manufacturing.list.query()
      this.setOrders(orders)
    })
  }

  async finishManufacturing(id: number) {
    await rpc.metal.manufacturing.finish.mutate({ id })
    this.load()
  }

  async deleteOrder(id: number) {
    await rpc.metal.manufacturing.delete.mutate({ id })
    this.load()
  }
}

export const listStore = new ManufacturingListStore()
