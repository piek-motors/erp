import { rpc } from 'lib/deps'
import { LoadingController } from 'lib/loading_controller'
import { matrixDecoder } from 'lib/matrix_decoder'
import { makeAutoObservable } from 'mobx'
import { ListManufacturingOutput } from 'srv/rpc/pdo/manufacturing/list'

export type ManufactoringListOutput = ListManufacturingOutput

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
      const encodedOrders = await rpc.pdo.manufacturing.list.query()
      const orders = matrixDecoder<ManufactoringListOutput>(encodedOrders)
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

export const s = new ManufacturingListStore()
