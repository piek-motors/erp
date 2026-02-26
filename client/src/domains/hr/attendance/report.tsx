import { type BoxProps, Stack, Tooltip } from '@mui/joy'
import moment from 'moment'
import { useRef } from 'react'
import type { Column } from 'react-table'
import { PrintOnly, WebOnly } from '@/components/utilities/conditional-display'
import {
  Box,
  ButtonXxs,
  Label,
  Loading,
  observer,
  P,
  Sheet,
  useState,
} from '@/lib'
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
    const printRef = useRef<HTMLDivElement>(null)

    const columns: Column<Employee>[] = [
      {
        Header: 'Фамилия Имя',
        accessor: data => (
          <Box p={0.3}>
            <P
              sx={{ width: 'min-content', lineHeight: 1.1, fontSize: '.9rem' }}
              level="body-md"
            >
              {data.name}
            </P>
            <P level="body-xs" sx={{ lineHeight: 1.1 }}>
              {data.job_title}
            </P>
            <WebOnly>
              <Label xs>{data.card}</Label>
            </WebOnly>
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
        ref={printRef}
        sx={{
          p: 1,
          borderRadius: 'sm',
          width: 'max-content',
        }}
      >
        <PrintPdfButton printRef={printRef} />
        <UpdateIntervalModal />
        <Label>Отчёт по рабочему времени за {report.month}</Label>
        <Label>Норма вычета времени: {report.timeRetention} мин</Label>
        <Label>
          Суммарный объём трудозатрат: {store.report?.resp.monthly_labor_hours}{' '}
          чел-ч
        </Label>
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

const PrintPdfButton = observer(
  ({ printRef }: { printRef: React.RefObject<HTMLDivElement | null> }) => {
    const handlePrint = () => {
      const el = printRef.current
      if (!el) return

      const originalTransform = el.style.transform
      const originalTransformOrigin = el.style.transformOrigin

      // Inject @page style — zero margins, landscape
      const styleId = '__print_page_style__'
      let styleEl = document.getElementById(styleId) as HTMLStyleElement | null
      if (!styleEl) {
        styleEl = document.createElement('style')
        styleEl.id = styleId
        document.head.appendChild(styleEl)
      }
      styleEl.textContent = `
    @page {
      size: A4 landscape;
      margin: 0;
      padding: 0;
    }
  `

      // Measure content width before any transform
      el.style.transform = 'none'
      const contentWidth = el.scrollWidth

      // A4 landscape at 96dpi = 1122px, but browsers apply ~0.75 scale factor
      // so effective CSS print px width is 1122 * (96/128) ≈ 794px...
      // empirically, just use 1122 and it matches correctly with margin:0
      const pagePadding = 5 // px padding on each side
      const pageWidth = 1122 - pagePadding * 2
      const scale = pageWidth / contentWidth

      el.style.transformOrigin = 'top left'
      el.style.transform = `translateX(${pagePadding}px) scale(${scale})`

      document.title = `Отчёт по рабочему времени за ${store.report?.month.replace('.', '')}`

      setTimeout(() => {
        window.print()

        el.style.transform = originalTransform
        el.style.transformOrigin = originalTransformOrigin
        styleEl!.textContent = ''
      }, 100)
    }

    return (
      <WebOnly>
        <ButtonXxs size="sm" onClick={handlePrint} variant="soft">
          PDF
        </ButtonXxs>
      </WebOnly>
    )
  },
)
