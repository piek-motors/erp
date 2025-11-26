import { MonthSelectStore } from 'components/inputs/month-select'
import { matrixDecoder } from 'lib/rpc/matrix_decoder'
import { rpc } from 'lib/rpc/rpc.client'
import { makeAutoObservable } from 'mobx'
import { OrderStatus } from 'models'
import moment from 'moment'
import { ClientOrder, OrderPosition } from 'srv/rpc/orders/router'
import { UnpackedOrder } from '../api'

class ReportPageStore {
  data: UnpackedOrder[] = []
  dataLabel = ''
  monthSelect: MonthSelectStore

  totalIncome = 0

  constructor() {
    this.monthSelect = new MonthSelectStore()
    makeAutoObservable(this, {
      monthSelect: true
    })
  }

  async init() {
    this.onSearch(this.monthSelect.month, this.monthSelect.year)
  }

  async onSearch(m: number, y: number) {
    this.monthSelect.isLoading = true
    this.totalIncome = 0
    try {
      const res = await rpc.orders.list.query({
        shipped_before: moment()
          .set('month', m)
          .set('year', y)
          .startOf('month')
          .utc(true)
          .valueOf(),
        shipped_after: moment()
          .set('month', m)
          .set('year', y)
          .endOf('month')
          .utc(true)
          .valueOf(),
        status: OrderStatus.Archived,
        ordering: { column: 'actual_shipping_date', type: 'desc' }
      })
      this.data = matrixDecoder<ClientOrder>(res).map(order => ({
        ...order,
        positions: matrixDecoder<OrderPosition>(order.positions)
      }))
      this.dataLabel = `Отгруженные заказы за ${this.monthSelect.getMonthLabel()}`
    } catch (error) {
      console.log('Error fetching orders:', error)
      this.data = []
    } finally {
      this.monthSelect.isLoading = false
    }

    for (const order of this.data) {
      this.totalIncome += Number(order.total_amount) ?? 0
    }
  }
}

export const report = new ReportPageStore()
