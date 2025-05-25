import { makeAutoObservable } from 'mobx'
import moment from 'moment'
import { apolloClient } from '../../api'
import { MonthSelectStore } from '../../components/month-select'
import {
  GetOrdersArchivedByIntervalDocument,
  GetOrdersArchivedByIntervalQuery,
  GetOrdersArchivedByIntervalQueryVariables,
  OrderFragment
} from '../../types/graphql-shema'

class ReportPageStore {
  data: OrderFragment[] = []
  dataLabel = ''
  monthSelect: MonthSelectStore

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
  }
}

export const report = new ReportPageStore()
