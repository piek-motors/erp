/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Sheet } from '@mui/joy'
import { useMemo } from 'react'
import { ManagerFilter, NavTabs, Search, TableName } from 'src/components'
import { RuMonths } from 'src/lib/constants'
import { formatOnlyDate, getPreviousMonth } from 'src/lib/date'
import { AppRoutes } from 'src/lib/routes'
import { RouteConfig } from 'src/types/global'
import { columnsList } from './columns'
import useReport from './report/useReport'
import { Table } from './shared/table'
import { useOrderListPageStore } from './state'
import { t } from './text'

function Report() {
  const { data } = useReport()
  const store = useOrderListPageStore()

  const columns = useMemo(() => {
    const a = [...columnsList]
    a[3] = {
      Header: 'Факт отгрузка',
      accessor: order => formatOnlyDate(order.ActualShippingDate)
    }
    return a
  }, [])

  if (data.loading) return null

  return (
    <>
      <NavTabs />
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

        <TableName name="Отгрузка в этом месяце" />
        {Array.isArray(data.ordersCurrentMonth) && (
          <Table columns={columns} data={data.ordersCurrentMonth} showUnpaid />
        )}

        <div
          css={css`
            margin-top: 30px;
          `}
        >
          <TableName name={`Отгрузка за ${RuMonths[getPreviousMonth()]}`} />
          {Array.isArray(data.ordersAccountingMonth) && (
            <Table
              columns={columns}
              data={data.ordersAccountingMonth}
              showUnpaid
            />
          )}
        </div>
      </Sheet>
    </>
  )
}

export default [
  {
    element: <Report />,
    path: AppRoutes.orders_report
  }
] as RouteConfig[]
