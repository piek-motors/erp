/** @jsxImportSource @emotion/react */
import { Box, Typography } from '@mui/joy'
import { MonthSelect } from 'components/month-select'
import { TableName } from 'components/table-name'
import { OrdersTable } from './columns'
import { report } from './report.store'
import { observer } from 'mobx-react-lite'

export const RequestReportPage = observer(() => {
  const isEmpty = Array.isArray(report.data) && report.data.length === 0
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
          <Typography level="body-sm">Нет данных</Typography>
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
