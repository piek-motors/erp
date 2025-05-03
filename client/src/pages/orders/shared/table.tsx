import { Table as MuiTable } from '@mui/joy'
import { useTable } from 'react-table'
import { AppRoutes } from 'src/lib/routes'

export function Table({ columns, data, className, showUnpaid }: TableProps) {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data
    })

  if (data.length === 0) return null
  return (
    <MuiTable {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup, i) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column, i) => (
              <th {...column.getHeaderProps()}>{column.render('Header')}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row)

          const { OrderID } = row.original
          const link = AppRoutes.order_detail.replace(':id', OrderID.toString())
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell, i) => {
                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
              })}
            </tr>
          )
        })}
      </tbody>
    </MuiTable>
  )
}

export type TableProps = {
  columns: any
  data: any[]
  className?: string
  showUnpaid?: boolean
}
