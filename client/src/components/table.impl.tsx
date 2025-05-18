/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { UilArrowDown, UilArrowUp } from '@iconscout/react-unicons'
import { Table as MuiTable, Sheet, Stack, Typography } from '@mui/joy'
import { Row, TableOptions, useSortBy, useTable } from 'react-table'

type Props<T extends object> = TableOptions<T> & {
  onRowClick?: (row: T) => void
  onDoubleRowClick?: (row: T) => void
  trStyleCallback?: (row: Row<T>) => React.CSSProperties
}
/**
 * Generic table implementation for metal-flow subsystem
 * @param props
 */
export function Table<T extends object>(props: Props<T>) {
  const { columns, data } = props
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data
      },
      useSortBy
    )
  if (data.length === 0) return
  return (
    <Sheet>
      <MuiTable {...getTableProps()} style={{ tableLayout: 'auto' }}>
        <thead>
          {headerGroups.map((headerGroup, i) => (
            <tr {...headerGroup.getHeaderGroupProps()} key={i}>
              {headerGroup.headers.map((column, i) => {
                const col = column as any
                return (
                  <th
                    {...column.getHeaderProps({
                      ...(column as any).getSortByToggleProps(),
                      width: 'min-content'
                    })}
                    key={i}
                  >
                    <Stack direction={'row'} alignItems={'center'}>
                      <Typography>{column.render('Header')}</Typography>
                      <SortingState
                        isSorted={col.isSorted}
                        isSortedDesc={col.isSortedDesc}
                      />
                    </Stack>
                  </th>
                )
              })}
            </tr>
          ))}
        </thead>
        {data.length && (
          <tbody {...getTableBodyProps()}>
            {rows.map((row, i) => {
              prepareRow(row)

              const cursor =
                props.onRowClick || props.onDoubleRowClick
                  ? 'pointer'
                  : 'default'

              return (
                <tr
                  {...row.getRowProps()}
                  css={css(css`
                    &:hover {
                      background-color: ${cursor === 'pointer'
                        ? 'rgba(0, 0, 0, 0.04)'
                        : 'inherit'};
                    }
                  `)}
                  style={{
                    ...(props.trStyleCallback
                      ? props.trStyleCallback(row)
                      : undefined),
                    cursor: cursor
                  }}
                  onClick={() => {
                    if (props.onRowClick) props.onRowClick(row.original)
                  }}
                  onDoubleClick={() => {
                    if (props.onDoubleRowClick)
                      props.onDoubleRowClick(row.original)
                  }}
                  key={i}
                >
                  {row.cells.map((cell, i) => {
                    return (
                      <td {...cell.getCellProps()} key={i}>
                        {cell.render('Cell')}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        )}
      </MuiTable>
    </Sheet>
  )
}

export function SortingState(props: {
  isSorted: boolean
  isSortedDesc: boolean
}) {
  const size = 13
  return (
    <span>
      {props.isSorted ? (
        props.isSortedDesc ? (
          <UilArrowDown width={size} height={size} />
        ) : (
          <UilArrowUp width={size} height={size} />
        )
      ) : (
        <div style={{ opacity: 0, visibility: 'hidden' }}>
          <UilArrowUp width={size} height={size} />
        </div>
      )}
    </span>
  )
}
