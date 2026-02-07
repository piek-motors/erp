/** @jsxImportSource @emotion/react */

import { Sheet } from '@/lib'
import type { Employee } from '@/server/domains/attendance/report_generator'
import { css } from '@emotion/react'
import { useTable } from 'react-table'

interface ITableProps {
  readonly columns: any[]
  readonly data: Employee[]
}

export function Table({ columns, data }: ITableProps) {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data,
    })

  return (
    <Sheet sx={{ overflow: 'visible' }}>
      <table
        {...getTableProps()}
        css={css`
          width: fit-content;
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
                        verticalAlign: 'top',
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
