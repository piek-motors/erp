import { BoxProps, Button, Stack } from '@mui/joy'
import { WebOnly } from 'components/utilities/conditional-display'
import { Box, Label, Loading, observer, Sheet } from 'lib'
import moment from 'moment'
import { Column } from 'react-table'
import { AttendanceEmployee } from 'srv/service/attendance_report.generator'
import { Report, store } from './store'
import { Table } from './table'
import {
  fmtDateToHoursAndMinutes,
  UpdateIntervalMetadata,
  UpdateIntervalModal,
  updateIntervalModalState
} from './update_interval.modal'

export const AttendanceReportComponent = observer(
  ({ report }: { report: Report }) => {
    const columns: Column<AttendanceEmployee>[] = [
      {
        Header: 'Фамилия Имя',
        accessor: data => (
          <Box sx={{ width: 'min-content', p: 0.5 }}>{data.name}</Box>
        )
      },
      {
        Header: '∑',
        Cell: props => (
          <Box p={0.2}>{(props.row.original.total / 3600).toFixed(0)}</Box>
        )
      },
      ...Array.from({ length: report.resp.daysInMonth }).map<
        Column<AttendanceEmployee>
      >((_, i) => {
        const day = i + 1
        return {
          Header: day.toString(),
          Cell: props => (
            <ReportCell
              employes={props.row.original}
              day={day}
              report={report}
            />
          )
        }
      })
    ]

    if (store.loader.loading) return <Loading />
    return (
      <Sheet
        sx={{
          p: 1,
          borderRadius: 'sm',
          width: 'max-content'
        }}
      >
        <UpdateIntervalModal />
        <Label>Отчет за {report.month}</Label>
        <Label>Норма вычета времени: {report.timeRetention} мин</Label>
        <Table columns={columns} data={report.resp.employees} />
      </Sheet>
    )
  }
)

const ReportCell = observer(
  (props: { employes: AttendanceEmployee; day: number; report: Report }) => {
    const employee = props.employes.name
    const data = props.employes.days[props.day]
    const meta: UpdateIntervalMetadata = {
      employee,
      day: props.day,
      month: store.monthSelect.getMonthLabel()
    }
    return (
      <Stack
        sx={{ fontSize: '0.86rem' }}
        bgcolor={
          data.intervals &&
          data.intervals[0]?.ent_event_id === store.updatedIntervalId
            ? 'greenyellow'
            : undefined
        }
      >
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
        {props.report.isFull && <EditInterval data={data} meta={meta} />}
        <Box>
          {!!data.total_dur && (
            <Time sx={{ fontWeight: 600, color: 'primary.500' }}>
              {moment(data.total_dur * 1000)
                .utcOffset(0, false)
                .format('H:mm')}
            </Time>
          )}
        </Box>
      </Stack>
    )
  }
)

const EditInterval = observer(
  ({
    data,
    meta
  }: {
    data: AttendanceEmployee['days'][number]
    meta: UpdateIntervalMetadata
  }) => (
    <WebOnly>
      {data.broken && data.intervals.length === 1 && (
        <Button
          variant="solid"
          color="primary"
          size="sm"
          sx={{
            width: 'min-content',
            m: '0 auto',
            fontSize: '.8rem',
            fontWeight: 400,
            minHeight: 'min-content'
          }}
          onClick={() => updateIntervalModalState.open(data.intervals[0], meta)}
        >
          set
        </Button>
      )}
    </WebOnly>
  )
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
