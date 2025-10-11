import { rpc } from 'lib/deps'
import { LoadingController } from 'lib/loading_controller'
import { makeAutoObservable } from 'mobx'
import { RouterOutput } from 'srv/lib/trpc'

export type ManufactoringListOutput =
  RouterOutput['pdo']['manufacturing']['list'][number]

export class ManufacturingListStore {
  readonly async = new LoadingController()

  orders: ManufactoringListOutput[] = []
  setOrders(orders: ManufactoringListOutput[]) {
    this.orders = orders
  }

  constructor() {
    makeAutoObservable(this)
  }

  async load() {
    this.async.run(async () => {
      const orders = await rpc.pdo.manufacturing.list.query()
      this.setOrders(orders)
    })
  }

  async finishManufacturing(id: number) {
    await rpc.pdo.manufacturing.finish.mutate({ id })
    this.load()
  }

  async deleteOrder(id: number) {
    await rpc.pdo.manufacturing.delete.mutate({ id })
    this.load()
  }
}

export const listStore = new ManufacturingListStore()
