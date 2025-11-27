/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Sheet } from 'lib'
import { useTable } from 'react-table'
import { AttendanceEmployee } from 'srv/service/attendance_report.generator'

interface ITableProps {
  readonly columns: any[]
  readonly data: AttendanceEmployee[]
}

export function Table({ columns, data }: ITableProps) {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data
    })

  return (
    <Sheet sx={{ overflow: 'visible', width: '100%' }}>
      <table
        {...getTableProps()}
        css={css`
          width: 100%;
          border-collapse: collapse;
        `}
      >
        <thead>
          {headerGroups.map((headerGroup, i) => (
            <tr
              {...headerGroup.getHeaderGroupProps()}
              style={{ padding: '0 4px' }}
              key={i}
            >
              {headerGroup.headers.map((column, i) => (
                <th {...column.getHeaderProps()} key={i}>
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()} key={i}>
                {row.cells.map((cell, i) => {
                  return (
                    <td
                      {...cell.getCellProps()}
                      style={{
                        border: '1px solid #9e9797ff',
                        padding: '0px 1px',
                        verticalAlign: 'top'
                      }}
                      key={i}
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
    </Sheet>
  )
}
