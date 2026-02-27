import { type BoxProps, Stack, Tooltip } from '@mui/joy'
import moment from 'moment'
import { PrintOnly } from '@/components/utilities/conditional-display'
import { Box, observer, P, useState } from '@/lib'
import { Hour } from '@/lib/constants'
import type { Employee } from '@/server/domains/hr/attendance/report_generator'
import { employee_model_vm } from '../modals/events_modal'
import {
  fmtHourMinute,
  UpdateIntervalButton,
  type UpdateIntervalMetadata,
} from '../modals/update_interval_modal'
import { vm } from './view_model'

export const ReportCell = observer(
  (props: { employee: Employee; date: Date }) => {
    const [data, setData] = useState(props.employee.days[props.date.getDate()])
    const meta: UpdateIntervalMetadata = {
      employee: props.employee,
      date: props.date,
      month: vm.config.monthSelect.getMonthLabel(),
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
        sx={{ height: 'inherit' }}
      >
        <Stack
          onDoubleClick={() => {
            employee_model_vm.open(props.employee, props.date)
          }}
          sx={{
            fontSize: '0.86rem',
            lineHeight: 1.2,
            px: 0.3,
            height: 'inherit',
            outline: isUpdatedRecently ? '2.5px dashed darkred' : undefined,
          }}
        >
          {data.intervals.length === 0 && (
            <P level="body-sm" color="primary" textAlign={'center'}>
              {data.absence}
            </P>
          )}
          {vm.config.full_view &&
            data.intervals.map(interval => (
              <>
                {interval.ent && <Time>{fmtHourMinute(interval.ent)}</Time>}
                {interval.ext && <Time>{fmtHourMinute(interval.ext)}</Time>}
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
          {vm.report!.isFull && (
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
  <Box
    sx={{
      ...props.sx,
      whiteSpace: 'nowrap',
      fontSize: '0.8rem',
      textAlign: 'center',
    }}
  >
    <div>{props.children}</div>
  </Box>
)
