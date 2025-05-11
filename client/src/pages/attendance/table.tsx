/** @jsxImportSource @emotion/react */
import { Box } from '@mui/joy'
import { useTable } from 'react-table'
import { PreparedEmployeeDto } from 'src/types/global'

interface ITableProps {
  readonly columns: any[]
  readonly data: PreparedEmployeeDto[]
  readonly className?: string
}

export default function Table({ columns, data, className }: ITableProps) {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data
    })

  return (
    <Box p={1}>
      <table
        {...getTableProps()}
        style={{
          width: '100%',
          borderCollapse: 'collapse'
        }}
      >
        <thead>
          {headerGroups.map((headerGroup, i) => (
            <tr
              {...headerGroup.getHeaderGroupProps()}
              style={{ textAlign: 'left' }}
            >
              {headerGroup.headers.map((column, i) => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell, i) => {
                  return (
                    <td
                      {...cell.getCellProps()}
                      style={{
                        border: '1px solid #8b8787',
                        borderRadius: '5px'
                      }}
                    >
                      {cell.render('Cell')}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </Box>
  )
}
