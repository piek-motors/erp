import { Typography } from '@mui/joy'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ManagerFilter, Search } from 'src/components'
import { useFilter } from 'src/hooks'
import { OrderStatus } from 'src/types/global'
import {
  useGetOrdersByStatusQuery,
  useInsertOrderMutation
} from 'src/types/graphql-shema'
import { columnsList } from './columns'
import { Table } from './shared/table'
import { useOrderListPageStore } from './state'
import { t } from './text'

export function Registration() {
  const store = useOrderListPageStore()
  const navigate = useNavigate()

  const [insertOrderMutation] = useInsertOrderMutation({
    variables: {
      orderStatusID: OrderStatus.ordRegistration
    }
  })

  function insertOrderHandler() {
    insertOrderMutation().then(res => {
      navigate(
        `/orders/${res.data?.insert_erp_Orders?.returning[0].OrderID}?edit=true`
      )
    })
  }

  const { data } = useGetOrdersByStatusQuery({
    variables: {
      orderStatus: 1
    },
    fetchPolicy: 'cache-and-network',
    pollInterval: 50000
  })

  const orders = useFilter({
    orders: data?.erp_Orders || [],
    options: {
      managerId: store.managerId,
      searchKeyword: store.searchTerm
    }
  })

  const columns = useMemo(() => columnsList, [])

  return (
    <>
      <Search
        value={store.searchTerm}
        onChange={store.searchInputHandler}
        placeholder={t.InputPlaceholder}
      >
        <ManagerFilter
          value={store.managerId}
          onChange={store.managerFilterHandler}
        />
      </Search>

      {data?.erp_Orders && <Table columns={columns} data={orders} />}
      {!orders.length && (
        <Typography m={2}>(ノ#-_-)ノ ничего не найдено</Typography>
      )}
    </>
  )
}
