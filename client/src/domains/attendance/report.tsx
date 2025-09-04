import { BoxProps, Stack } from '@mui/joy'
import { Box, Label, Loading, P, Sheet } from 'lib'
import { sec2hours } from 'lib/date'
import moment from 'moment'
import { Column } from 'react-table'
import {
  AttendanceEmployee,
  AttendanceReport
} from 'srv/service/attendance_report_generator'
import { store } from './store'
import { Table } from './table'

export const AttendanceReportComponent = (props: {
  report: AttendanceReport
}) => {
  const columns: Column<AttendanceEmployee>[] = [
    {
      Header: 'Фамилия Имя',
      accessor: data => (
        <P>{data.name.replace(/\d+/g, '').replace(/\s+/g, ' ').trim()}</P>
      )
    },
    {
      Header: '∑',
      Cell: props => sec2hours(props.row.original.total)
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
            <Stack sx={{ fontSize: '0.86rem' }}>
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
              <Box>
                {!!data.total_dur && (
                  <Time sx={{ fontWeight: 600, color: 'primary.500' }}>
                    {formatTimeToHoursAndMinutes(data.total_dur)}
                  </Time>
                )}
              </Box>
            </Stack>
          )
        }
      }
    })
  ]
  if (store.async.loading) return <Loading />
  return (
    <Sheet
      sx={{
        p: 1,
        borderRadius: 'sm',
        width: 'max-content'
      }}
    >
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
    <Box sx={{ ...props.sx, whiteSpace: 'nowrap', fontSize: '0.86rem' }}>
      <div>{props.children}</div>
    </Box>
  )
}
