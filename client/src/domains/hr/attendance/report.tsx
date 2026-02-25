import { type BoxProps, Stack, Tooltip } from '@mui/joy'
import moment from 'moment'
import type { Column } from 'react-table'
import { PrintOnly } from '@/components/utilities/conditional-display'
import { Box, Label, Loading, observer, P, Sheet, useState } from '@/lib'
import { Hour } from '@/lib/constants'
import { createDateAsUTC } from '@/lib/utils/date_fmt'
import type { Employee } from '@/server/domains/hr/attendance/report_generator'
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
          <Box sx={{ width: 'min-content', p: 0.3, lineHeight: 1.1 }}>
            {data.name} <Label xs>{data.card}</Label>
          </Box>
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
            lineHeight: 1.2,
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
          {!!data.total_dur && (
            <>
              <Box textAlign={'center'}>
                <ShiftDuration total_dur={data.total_dur} />{' '}
              </Box>
              {/* // Padding is required to make possible to add handwrited edits */}
              <PrintOnly>
                <Box pb={2.5} />
              </PrintOnly>
            </>
          )}
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
const ShiftDuration = (props: { total_dur: number }) => {
  const dur_ms = props.total_dur * 1000
  const value =
    dur_ms == 8 * Hour ? '8' : moment(dur_ms).utcOffset(0, false).format('H:mm')
  return <Time sx={{ fontWeight: 600, color: 'primary.500' }}>{value}</Time>
}

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
