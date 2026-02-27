import { Container, Stack } from '@mui/joy'
import { useEffect, useRef } from 'react'
import { WebOnly } from '@/components/utilities/conditional-display'
import { Label, Loading, observer, P, Row, Sheet } from '@/lib'
import { createDateAsUTC } from '@/lib/utils/date_fmt'
import { AbsenceLabels } from '../absence'
import { EmployeeEventsModal } from './modals/events_modal'
import { type ColumnDef, Table } from '../table'
import { UpdateIntervalModal } from './modals/update_interval_modal'
import { vm } from './view_model'
import { ReportCell } from './cell'
import { PrintPdfButton } from './print_btn'

export const AttendanceReportView = observer(() => {
  const printRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    vm.load_from_query_params(window.location.search)
  }, [])

  if (vm.loading || !vm.report) return <Loading />

  const columns: ColumnDef[] = [
    {
      id: 'employee',
      header: 'Фамилия Имя',
      renderHeader: () => (
        <Stack p={0.3} gap={0.2}>
          <P sx={{ lineHeight: 1.1, fontSize: '.9rem' }} level="body-md">
            Фамилия Имя
          </P>
        </Stack>
      ),
      renderCell: data => (
        <Stack p={0.3} gap={0.2} width={'min-content'}>
          <P
            sx={{ lineHeight: 1.1, fontSize: '.9rem', width: 'min-content' }}
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
        </Stack>
      ),
    },
    {
      id: 'total',
      header: '∑',
      width: '30px',
      renderCell: employee => (
        <P p={0.2} fontSize={'.8rem'}>
          {(employee.total / 3600).toFixed(0)}
        </P>
      ),
    },
    ...vm.report.resp.days.map<ColumnDef>(day => {
      const date = createDateAsUTC(
        new Date(vm.config.monthSelect.year, vm.config.monthSelect.month, day),
      )
      return {
        id: `day-${day}`,
        header: day.toString(),
        width: 'auto',
        renderCell: employee => <ReportCell employee={employee} date={date} />,
      }
    }),
  ]

  return (
    <Stack
      alignItems={'center'}
      sx={{
        '@media print': {
          alignItems: 'flex-start',
          p: '10px',
          m: 0,
          boxSizing: 'border-box',
        },
      }}
    >
      <Sheet
        ref={printRef}
        sx={{
          pb: 2,
          width: '100%',
          '@media print': {
            p: 0,
            m: 0,
          },
        }}
      >
        <Container maxWidth="md">
          <Stack p={1} alignItems={'center'}>
            <EmployeeEventsModal />
            <UpdateIntervalModal />
            <Row gap={2}>
              <P>Отчёт по рабочему времени за {vm.report.month}</P>
              <PrintPdfButton printRef={printRef} />
            </Row>
            <Label xs>
              Совокупный объём трудозатрат:{' '}
              {vm.report?.resp.monthly_labor_hours} чел-ч
            </Label>
            <Label xs>
              Норма вычета времени: {vm.report.timeRetention} мин
            </Label>
            <AbsenceLabels />
          </Stack>
        </Container>
        <Table columns={columns} data={vm.report.resp.employees} />
      </Sheet>
    </Stack>
  )
})
