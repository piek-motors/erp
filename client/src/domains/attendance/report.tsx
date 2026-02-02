import { type BoxProps, Stack, Tooltip } from '@mui/joy'
import { Box, Label, Loading, observer, P, Sheet, useState } from 'lib'
import { createDateAsUTC } from 'lib/utils/date_fmt'
import moment from 'moment'
import type { Column } from 'react-table'
import { Employee } from 'srv/domains/attendance/report_generator'
import { AbsenceLabels } from './absence'
import { type Report, store } from './store'
import { Table } from './table'
import {
	fmtDateToHoursAndMinutes,
	UpdateIntervalButton,
	type UpdateIntervalMetadata,
	UpdateIntervalModal,
} from './update_interval'

export const AttendanceReportComponent = observer(
	({ report }: { report: Report }) => {
		const columns: Column<Employee>[] = [
			{
				Header: 'Фамилия Имя',
				accessor: data => (
					<Box sx={{ width: 'min-content', p: 0.5 }}>{data.name}</Box>
				),
			},
			{
				Header: '∑',
				Cell: props => (
					<Box p={0.2}>{(props.row.original.total / 3600).toFixed(0)}</Box>
				),
			},
			...report.resp.days.map<Column<Employee>>(day => {
				const date = createDateAsUTC(
					new Date(store.monthSelect.year, store.monthSelect.month, day),
				)
				return {
					Header: day.toString(),
					Cell: props => (
						<ReportCell
							employee={props.row.original}
							date={date}
							report={report}
						/>
					),
				}
			}),
		]

		if (store.loader.loading) return <Loading />
		return (
			<Sheet
				sx={{
					p: 1,
					borderRadius: 'sm',
					width: 'max-content',
				}}
			>
				<UpdateIntervalModal />
				<Label>Отчет за {report.month}</Label>
				<Label>Норма вычета времени: {report.timeRetention} мин</Label>
				<AbsenceLabels />
				<Table columns={columns} data={report.resp.employees} />
			</Sheet>
		)
	},
)

const ReportCell = observer(
	(props: { employee: Employee; date: Date; report: Report }) => {
		const [data, setData] = useState(props.employee.days[props.date.getDate()])
		const meta: UpdateIntervalMetadata = {
			employee: props.employee,
			date: props.date,
			month: store.monthSelect.getMonthLabel(),
		}
		const isUpdatedRecently = data.intervals.some(
			each => each.updated_manually === true,
		)

		const weekday = props.date.toLocaleDateString('ru', { weekday: 'short' })

		return (
			<Tooltip
				title={`${props.date.getDate()} ${weekday}`}
				arrow
				size="sm"
				placement="top"
			>
				<Stack
					sx={{
						fontSize: '0.86rem',
						outline: isUpdatedRecently ? '2.5px dashed darkred' : undefined,
					}}
				>
					{data.intervals.length === 0 && (
						<P level="body-sm" color="primary" textAlign={'center'}>
							{data.absence}
						</P>
					)}
					{data.intervals.map(interval => (
						<>
							{interval.ent && (
								<Time>
									{ArrowRight()}
									{fmtDateToHoursAndMinutes(interval.ent)}
								</Time>
							)}
							{interval.ext && (
								<Time>
									{ArrowLeft()}
									{fmtDateToHoursAndMinutes(interval.ext)}
								</Time>
							)}
						</>
					))}
					<Box>
						{!!data.total_dur && (
							<Time sx={{ fontWeight: 600, color: 'primary.500' }}>
								{moment(data.total_dur * 1000)
									.utcOffset(0, false)
									.format('H:mm')}
							</Time>
						)}
					</Box>
					{props.report.isFull && (
						<UpdateIntervalButton
							data={data}
							meta={meta}
							onReasonSet={r => setData({ ...data, absence: r })}
						/>
					)}
				</Stack>
			</Tooltip>
		)
	},
)

const Time = (props: { children: React.ReactNode; sx?: BoxProps }) => (
	<Box sx={{ ...props.sx, whiteSpace: 'nowrap', fontSize: '0.86rem' }}>
		<div>{props.children}</div>
	</Box>
)

const ArrowLeft = () => {
	return <span>{'\u2190'}</span> // ←
}

const ArrowRight = () => {
	return <span>{'\u2192'}</span> // →
}
