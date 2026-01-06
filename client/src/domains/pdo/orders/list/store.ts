import { rpc } from 'lib/deps'
import { matrixDecoder } from 'lib/rpc/matrix_decoder'
import { LoadingController } from 'lib/store/loading_controller'
import { makeAutoObservable } from 'mobx'
import { ListOrdersOutput } from 'srv/rpc/pdo/orders'

export class ManufacturingListStore {
  readonly async = new LoadingController()

  orders: ListOrdersOutput[] = []
  setOrders(orders: ListOrdersOutput[]) {
    this.orders = orders
  }

  constructor() {
    makeAutoObservable(this)
  }

  async load() {
    this.async.run(async () => {
      const encodedOrders = await rpc.pdo.orders.list.query()
      const orders = matrixDecoder<ListOrdersOutput>(encodedOrders)
      this.setOrders(orders)
    })
  }

  async finishManufacturing(id: number) {
    await rpc.pdo.orders.finish.mutate({ id })
    this.load()
  }

  async deleteOrder(id: number) {
    await rpc.pdo.orders.delete.mutate({ id })
    this.load()
  }
}

export const s = new ManufacturingListStore()
