import { MonthSelectStore } from 'components/month-select'
import { apolloClient } from 'lib/api'
import {
  GetOrdersArchivedByIntervalDocument,
  GetOrdersArchivedByIntervalQuery,
  GetOrdersArchivedByIntervalQueryVariables,
  OrderFragment
} from 'lib/types/graphql-shema'
import { makeAutoObservable } from 'mobx'
import moment from 'moment'

class ReportPageStore {
  data: OrderFragment[] = []
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
      const gte = moment()
        .set('month', m)
        .set('year', y)
        .startOf('month')
        .toISOString()
      const lte = moment()
        .set('month', m)
        .set('year', y)
        .endOf('month')
        .toISOString()
      const res = await apolloClient.query<
        GetOrdersArchivedByIntervalQuery,
        GetOrdersArchivedByIntervalQueryVariables
      >({
        query: GetOrdersArchivedByIntervalDocument,
        variables: {
          _gte: gte,
          _lte: lte
        }
      })

      if (res.errors) {
        console.error('Error fetching orders:', res.errors)
        this.data = []
      } else {
        this.data = res.data?.orders_orders || []
        this.dataLabel = `Отгруженные заказы за ${this.monthSelect.getMonthLabel()}`
      }
    } catch (error) {
      console.log('Error fetching orders:', error)
      this.data = []
    } finally {
      this.monthSelect.isLoading = false
    }

    for (const order of this.data) {
      this.totalIncome += order.total_amount
    }
  }
}

export const report = new ReportPageStore()
