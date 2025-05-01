import { Link } from 'react-router-dom'
import { useTable } from 'react-table'
import { AppRoutes } from 'src/lib/routes'
import styles from '../table.module.sass'
import { statusHighlighting } from '../utils'

export function Table({ columns, data, className, showUnpaid }: TableProps) {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data
    })

  if (data.length === 0) return null
  return (
    <div
      className={`${styles.tableMain} ${className} ${styles.table}`}
      {...getTableProps()}
    >
      <div className={styles.thead}>
        {headerGroups.map((headerGroup, i) => (
          <div className={styles.tr} {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column, i) => (
              <div className={styles.th} {...column.getHeaderProps()}>
                {column.render('Header')}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div {...getTableBodyProps()} className={styles.tbody}>
        {rows.map((row, i) => {
          prepareRow(row)

          const { OrderID } = row.original
          const link = AppRoutes.order_detail.replace(':id', OrderID.toString())
          return (
            <Link
              to={link}
              className={`${statusHighlighting(row.original)} ${
                styles.tableRow
              }`}
              {...row.getRowProps()}
            >
              {row.cells.map((cell, i) => {
                return (
                  <div className={styles.td} {...cell.getCellProps()}>
                    {cell.render('Cell')}
                  </div>
                )
              })}
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export type TableProps = {
  columns: any
  data: any[]
  className?: string
  showUnpaid?: boolean
}
