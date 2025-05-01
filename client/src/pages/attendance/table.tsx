/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'

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

  const styles = css`
    padding: 1em;
    border-collapse: collapse;
    width: 100%;

    thead th {
      position: sticky;
      top: -3px;
      z-index: 10;
      background: var(--L1);
      padding: 13px 0;
      font-weight: normal;
    }

    tbody tr:hover {
      background: var(--L2);
    }
    tbody td {
      border: var(--border) !important;
      padding: 2px 5px;
      min-width: 30px;
    }
    .monthlyWithRetention {
      font-weight: 600;
    }
    .monthlyWithRetentionResolved,
    .resolved {
      color: var(--accent);
      font-weight: 700;
    }
  `
  return (
    <table css={styles} {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup, i) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column, i) => (
              <th {...column.getHeaderProps()}>{column.render('Header')}</th>
            ))}
          </tr>
        ))}
      </thead>
      {data.length ? (
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell, i) => {
                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                })}
              </tr>
            )
          })}
        </tbody>
      ) : (
        <div style={{ padding: '10px' }}>Нет данных</div>
      )}
    </table>
  )
}
