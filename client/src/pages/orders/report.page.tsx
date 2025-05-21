/** @jsxImportSource @emotion/react */
import { Box, Typography } from '@mui/joy'
import { MonthSelect } from 'components/month-select'
import { TableName } from 'components/table-name'
import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { OrdersTable } from './columns'
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
