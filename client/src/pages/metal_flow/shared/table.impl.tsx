import { UilArrowDown, UilArrowUp } from '@iconscout/react-unicons'
import {
  Table as MuiTable,
  Stack,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip
} from '@mui/material'
import { TableOptions, useSortBy, useTable } from 'react-table'

type Props<T extends object> = TableOptions<T> & {
  onDoubleRowClick?: (row: T) => void
}
/**
 * Generic table implementation for metal-flow subsystem
 * @param props
 */
export function Table<T extends object>(props: Props<T>) {
  const { columns, data, onDoubleRowClick } = props
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data
      },
      useSortBy
    )

  return (
    <TableContainer
      sx={{
        flex: 1,
        overflowY: 'auto'
      }}
    >
      <MuiTable
        {...getTableProps()}
        stickyHeader
        size="small"
        padding="checkbox"
        sx={{
          th: {}
        }}
      >
        <TableHead>
          {headerGroups.map((headerGroup, i) => (
            <TableRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, i) => {
                const col = column as any

                return (
                  <TableCell
                    {...column.getHeaderProps(
                      (column as any).getSortByToggleProps()
                    )}
                  >
                    <Tooltip title="Отсортировать?" placement="top">
                      <Stack direction={'row'} alignItems={'center'}>
                        <div>{column.render('Header')}</div>
                        <SortingState
                          isSorted={col.isSorted}
                          isSortedDesc={col.isSortedDesc}
                        />
                      </Stack>
                    </Tooltip>
                  </TableCell>
                )
              })}
            </TableRow>
          ))}
        </TableHead>
        {data.length ? (
          <TableBody {...getTableBodyProps()}>
            {rows.map((row, i) => {
              prepareRow(row)
              return (
                <TableRow
                  {...row.getRowProps()}
                  onDoubleClick={() => onDoubleRowClick?.(row.original)}
                >
                  {row.cells.map((cell, i) => {
                    return (
                      <TableCell {...cell.getCellProps()}>
                        {cell.render('Cell')}
                      </TableCell>
                    )
                  })}
                </TableRow>
              )
            })}
          </TableBody>
        ) : (
          <div style={{ padding: '10px' }}>Нет данных</div>
        )}
      </MuiTable>
    </TableContainer>
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
