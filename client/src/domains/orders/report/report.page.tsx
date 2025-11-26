import { Box } from '@mui/joy'
import { MonthSelect } from 'components/inputs/month-select'
import { P } from 'lib/index'
import { formatMoney } from 'lib/utils/fmt'
import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { columns, OrdersTable, withActualShippingDate } from '../columns'
import { report } from './report.store'

export const RequestReportPage = observer(() => {
  const isEmpty = Array.isArray(report.data) && report.data.length === 0

  useEffect(() => {
    report.init()
  }, [])

  return (
    <>
      <MonthSelect
        store={report.monthSelect}
        onSearch={async (m, y) => {
          report.onSearch(m, y)
        }}
      />
      {isEmpty && (
        <Box>
          <P level="body-sm">Нет данных</P>
        </Box>
      )}
      {Array.isArray(report.data) && report.data.length > 0 && (
        <>
          {report.dataLabel && <P>{report.dataLabel}</P>}
          <P level="body-sm" py={1}>
            Общая выручка: {formatMoney(report.totalIncome)}
          </P>
          <OrdersTable
            data={report.data}
            columns={withActualShippingDate(columns)}
          />
        </>
      )}
    </>
  )
})
