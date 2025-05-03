import { UilArrowDown, UilArrowUp } from '@iconscout/react-unicons'
import { Table as MuiTable, Sheet, Stack, Tooltip, Typography } from '@mui/joy'
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
    <Sheet sx={{ p: 1, my: 1, borderRadius: 12 }} variant="soft">
      <MuiTable {...getTableProps()} stickyHeader stickyFooter size="sm">
        <thead>
          {headerGroups.map((headerGroup, i) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, i) => {
                const col = column as any
                return (
                  <th
                    {...column.getHeaderProps({
                      ...(column as any).getSortByToggleProps(),
                      minWidth: column.minWidth,
                      width: column.width
                    })}
                  >
                    <Tooltip title="Отсортировать?" placement="top">
                      <Stack direction={'row'} alignItems={'center'}>
                        <Typography>{column.render('Header')}</Typography>
                        <SortingState
                          isSorted={col.isSorted}
                          isSortedDesc={col.isSortedDesc}
                        />
                      </Stack>
                    </Tooltip>
                  </th>
                )
              })}
            </tr>
          ))}
        </thead>
        {data.length ? (
          <tbody {...getTableBodyProps()}>
            {rows.map((row, i) => {
              prepareRow(row)
              return (
                <tr
                  {...row.getRowProps()}
                  onDoubleClick={() => onDoubleRowClick?.(row.original)}
                >
                  {row.cells.map((cell, i) => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        ) : (
          <div style={{ padding: '10px' }}>Нет данных</div>
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
