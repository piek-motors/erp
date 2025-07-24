import { BoxProps, Divider, Stack } from '@mui/joy'
import { Box, Label, LoadingHint, Sheet } from 'lib'
import { sec2hours } from 'lib/date'
import { roundAndTrim } from 'lib/utils/formatting'
import moment from 'moment'
import { Column } from 'react-table'
import {
  AttendanceEmployee,
  AttendanceReport
} from '../../../server/src/service/attendance_report_generator'
import { store } from './store'
import { Table } from './table'

export const AttendanceReportComponent = (props: {
  report: AttendanceReport
}) => {
  const columns: Column<AttendanceEmployee>[] = [
    {
      Header: 'Фамилия Имя',
      accessor: data => data.name
    },
    {
      Header: '∑',
      Cell: props => {
        const retentionHours =
          (props.row.original.workDays * store.timeRetention) / 60
        return (
          <>
            <div>∑{sec2hours(props.row.original.total)}</div>
            <div>-{roundAndTrim(retentionHours, 0)}</div>
            <div>
              ={sec2hours(props.row.original.total - retentionHours * 60 * 60)}
            </div>
          </>
        )
      }
    },
    ...Array.from({ length: props.report.daysInMonth }).map<
      Column<AttendanceEmployee>
    >((v, i) => {
      const day = i + 1
      return {
        Header: day.toString(),
        Cell: props => {
          const data = props.row.original.days[day]
          return (
            <Stack>
              {data.intervals.map(interval => (
                <>
                  {interval.ent && (
                    <Time>
                      -&gt;{formatTimeToHoursAndMinutes(interval.ent)}
                    </Time>
                  )}
                  {interval.ext && (
                    <Time>
                      &lt;-{formatTimeToHoursAndMinutes(interval.ext)}
                    </Time>
                  )}
                </>
              ))}
              <Divider />
              <Box>
                {!!data.total_dur && (
                  <Time sx={{ fontWeight: 700, color: 'primary.500' }}>
                    ={formatTimeToHoursAndMinutes(data.total_dur)}
                  </Time>
                )}
              </Box>
            </Stack>
          )
        }
      }
    })
  ]
  return (
    <Sheet sx={{ p: 2, borderRadius: 'sm', width: 'max-content' }}>
      <LoadingHint show={store.async.loading} />
      <Label>
        Отчет за{' '}
        {new Date(
          store.monthSelect.year,
          store.monthSelect.month,
          1
        ).toLocaleDateString('ru-RU', {
          month: 'long',
          year: 'numeric'
        })}
      </Label>
      <Label>Норма вычета времени: {store.timeRetention} мин</Label>
      <Divider sx={{ my: 1 }} />
      <Table columns={columns} data={props.report.employees} />
    </Sheet>
  )
}

/**
 * @returns hours and minutes, e.g 8:31
 */
export const formatTimeToHoursAndMinutes = (
  payload: string | moment.Moment | number | null | undefined | Date
): string => {
  if (!payload) return ''
  if (typeof payload === 'number') {
    return moment.utc(payload * 1000).format('H:mm')
  }
  return moment(payload).format('H:mm')
}

function Time(props: { children: React.ReactNode; sx?: BoxProps }) {
  return (
    <Box sx={{ ...props.sx, whiteSpace: 'nowrap' }}>
      <div>{props.children}</div>
    </Box>
  )
}
