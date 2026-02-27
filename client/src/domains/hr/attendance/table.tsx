/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react'
import { memo } from 'react'
import { Sheet } from '@/lib'
import type { Employee } from '@/server/domains/hr/attendance/report_generator'

interface ITableProps {
  readonly columns: readonly ColumnDef[]
  readonly data: readonly Employee[]
}

export interface ColumnDef {
  id: string
  header: string
  width?: string
  renderHeader?: () => React.ReactNode
  renderCell: (employee: Employee) => React.ReactNode
}

const CELL_PADDING = '2px 4px'
const BORDER_COLOR = '#9e9797ff'

export const Table = memo(function Table({ columns, data }: ITableProps) {
  const gridTemplateColumns = columns
    .map((col, index) => {
      if (index === 0) return 'min-content'
      return col.width ?? 'auto'
    })
    .join(' ')

  return (
    <Sheet
      sx={{
        overflow: 'auto',
        maxHeight: '100vh',
        position: 'relative',
        '@media print': {
          overflow: 'visible',
          maxHeight: 'none',
        },
      }}
    >
      <div
        css={css`
          display: grid;
          margin: 0 auto;
          grid-template-columns: ${gridTemplateColumns};
          width: fit-content;
          border-collapse: collapse;
          @media print {
            width: 100%;
          }
        `}
      >
        {/* Header Row */}
        {columns.map((column, index) => (
          <div
            key={column.id}
            css={css`
              padding: ${CELL_PADDING};
              font-weight: 600;
              font-size: .8rem;
              text-align: center;
              border: .5px solid ${BORDER_COLOR};
              background: #fff;
              min-width: 0;
              white-space: nowrap;
              position: sticky;
              top: 0;
              z-index: 10;
              ${index === 0 ? 'left: 0; z-index: 11;' : ''}
            `}
          >
            {column.renderHeader?.() ?? column.header}
          </div>
        ))}

        {/* Data Rows */}
        {data.map((employee, rowIndex) => (
          <TableRow
            key={employee.id ?? rowIndex}
            employee={employee}
            columns={columns}
            rowIndex={rowIndex}
          />
        ))}
      </div>
    </Sheet>
  )
})

const TableRow = memo(function TableRow({
  employee,
  columns,
  rowIndex,
}: {
  employee: Employee
  columns: readonly ColumnDef[]
  rowIndex: number
}) {
  return (
    <>
      {columns.map((column, cellIndex) => (
        <div
          key={`${employee.id ?? rowIndex}-${column.id}`}
          css={css`
            border: .5px solid ${BORDER_COLOR};
            border-collapse: collapse;
            vertical-align: top;
            min-width: 0;
            height: 100%;
            ${cellIndex === 0 ? 'position: sticky; left: 0; z-index: 1; background: #fff;' : ''}
          `}
        >
          <div
            css={css`
          height: inherit;
          `}
          >
            {column.renderCell(employee)}
          </div>
        </div>
      ))}
    </>
  )
})
