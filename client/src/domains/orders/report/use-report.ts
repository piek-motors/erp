import { useFilter } from 'hooks'
import { matrixDecoder } from 'lib/matrix_decoder'
import { rpc } from 'lib/rpc.client'
import { OrderStatus } from 'models'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { UnpackedOrder } from '../api'
import { orderListPageStore as store } from '../list.store'

export function useReport() {
  const [ordersCurrentMounth, setOrdersCurrentMounth] = useState<
    UnpackedOrder[]
  >([])
  const [ordersAccountingMonth, setOrdersAccountingMonth] = useState<
    UnpackedOrder[]
  >([])

  useEffect(() => {
    rpc.orders.list
      .query({
        status: OrderStatus.Archived,
        shipped_before: moment().startOf('month').valueOf(),
        shipped_after: moment().endOf('month').valueOf()
      })
      .then(matrix =>
        setOrdersCurrentMounth(matrixDecoder<UnpackedOrder>(matrix))
      )
    rpc.orders.list
      .query({
        status: OrderStatus.Archived,
        shipped_before: moment()
          .subtract(1, 'months')
          .startOf('month')
          .valueOf(),
        shipped_after: moment().subtract(1, 'months').endOf('month').valueOf()
      })
      .then(matrix =>
        setOrdersAccountingMonth(matrixDecoder<UnpackedOrder>(matrix))
      )
  }, [])
  const ordersCurrentMonthFiltered = useFilter({
    orders: ordersCurrentMounth || [],
    options: {
      managerId: store.managerId,
      searchKeyword: store.searchTerm
    }
  })
  const ordersAccountingMonthFiltered = useFilter({
    orders: ordersAccountingMonth || [],
    options: {
      managerId: store.managerId,
      searchKeyword: store.searchTerm
    }
  })
  return {
    data: {
      loading: !Boolean(
        ordersAccountingMonthFiltered && ordersCurrentMonthFiltered
      ),
      ordersCurrentMonth: ordersCurrentMonthFiltered,
      ordersAccountingMonth: ordersAccountingMonthFiltered
    }
  }
}
