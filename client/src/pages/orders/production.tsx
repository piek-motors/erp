import { Sheet, Typography } from '@mui/joy'
import { useMemo } from 'react'
import { ManagerFilter, NavTabs, Search } from 'src/components'
import { useFilter } from 'src/hooks'
import { AppRoutes } from 'src/lib/routes'
import { RouteConfig } from 'src/types/global'
import { useGetOrdersByStatusQuery } from 'src/types/graphql-shema'
import { columnsList } from './columns'
import { Table } from './shared/table'
import { useOrderListPageStore } from './state'
import { t } from './text'

function Production() {
  const store = useOrderListPageStore()

  const { data } = useGetOrdersByStatusQuery({
    variables: {
      orderStatus: 2
    },
    fetchPolicy: 'cache-and-network',
    pollInterval: 50000
  })

  const columns = useMemo(() => columnsList, [])

  const orders = useFilter({
    orders: data?.erp_Orders || [],
    options: {
      managerId: store.managerId,
      searchKeyword: store.searchTerm
    }
  })

  return (
    <>
      <NavTabs />

      {orders && (
        <Sheet>
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

          <Table columns={columns} data={orders} />
          {!orders.length && (
            <Typography m={2}>(ノ#-_-)ノ ничего не найдено</Typography>
          )}
        </Sheet>
      )}
    </>
  )
}

export default [
  {
    element: <Production />,
    path: AppRoutes.orders_production
  }
] as RouteConfig[]
