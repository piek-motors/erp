/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Sheet } from 'lib'
import { useTable } from 'react-table'
import { AttendanceEmployee } from '../../../server/src/service/attendance_report_generator'

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
    <Sheet sx={{ overflow: 'visible', width: 'max-content' }}>
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
                        border: '1px solid #d3cbcb',
                        padding: '0px 4px'
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
    </Sheet>
  )
}
