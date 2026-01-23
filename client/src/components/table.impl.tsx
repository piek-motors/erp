/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Table as MuiTable, Stack } from '@mui/joy'
import type { SxProps } from '@mui/joy/styles/types'
import { P } from 'lib/index'
import { type Row, type TableOptions, useSortBy, useTable } from 'react-table'

type Props<T extends object> = TableOptions<T> & {
	onRowClick?: (row: T) => void
	onDoubleRowClick?: (row: T) => void
	rowStyleCb?: (row: Row<T>) => React.CSSProperties
	small?: boolean
	sx?: SxProps
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
				data,
			},
			useSortBy,
		)
	if (data.length === 0) return
	return (
		<MuiTable
			{...getTableProps()}
			style={{ tableLayout: 'auto' }}
			size={props.small ? 'sm' : 'md'}
			sx={props.sx}
		>
			<thead>
				{headerGroups.map((headerGroup, i) => (
					<tr {...headerGroup.getHeaderGroupProps()} key={i}>
						{headerGroup.headers.map((column, i) => {
							const col = column as any
							return (
								<th key={i}>
									<Stack direction={'row'} alignItems={'center'}>
										<P>{column.render('Header')}</P>
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
							props.onRowClick || props.onDoubleRowClick ? 'pointer' : 'default'

						return (
							<tr
								{...row.getRowProps()}
								css={css(css`
                  &:hover {
                    background-color: ${
											cursor === 'pointer' ? 'rgba(0, 0, 0, 0.04)' : 'inherit'
										};
                  }
                `)}
								style={{
									...(props.rowStyleCb ? props.rowStyleCb(row) : undefined),
									cursor: cursor,
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
	)
}
