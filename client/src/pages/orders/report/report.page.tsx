import { Box } from '@mui/joy'
import { MonthSelect } from 'components/month-select'
import { TableName } from 'components/table-name'
import { P } from 'lib/shortcuts'
import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { OrdersTable } from '../columns'
import { report } from '../stores/report.store'

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
          {report.dataLabel && <TableName name={report.dataLabel} />}
          <OrdersTable data={report.data} />
        </>
      )}
    </>
  )
})
