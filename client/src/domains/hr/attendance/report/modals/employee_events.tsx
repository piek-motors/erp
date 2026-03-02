import { Stack, Table } from '@mui/joy'
import { makeAutoObservable } from 'mobx'
import { observer } from 'mobx-react-lite'
import { type EventOrigin, UiEventOrigin } from 'models'
import { Label, Loading, P, Row, useEffect } from '@/lib'
import { rpc } from '@/lib/deps'
import { LoadingController } from '@/lib/store/loading_controller'
import type { Employee } from '@/server/domains/hr/attendance/report_generator'
import type { RouterOutput } from '@/server/lib/trpc'

class EmployeeEventVM {
  readonly loader = new LoadingController()

  employee: Employee | null = null
  date: Date | null = null

  constructor() {
    makeAutoObservable(this)
  }

  open(employee: Employee, date: Date) {
    this.employee = employee
    this.date = date
    this.load()
  }

  reset() {
    this.employee = null
    this.date = null
  }

  events: RouterOutput['hr']['attendance']['get_employee_events'] = []

  private async load() {
    this.events = []

    const cards = [this.employee?.card!, this.employee?.access_card].filter(
      Boolean,
    ) as string[]

    const events = await this.loader.run(() =>
      rpc.hr.attendance.get_employee_events.query({
        cards,
        date: this.date?.toISOString()!,
      }),
    )

    this.events = events
  }
}

export const state = new EmployeeEventVM()
export const employee_events_vm = state

interface Props {
  employee: Employee
  date: Date
}

export const EmployeeEvents = observer((props: Props) => {
  useEffect(() => {
    state.open(props.employee, props.date)
  }, [])

  return (
    <Stack>
      <Stack gap={0}>
        {state.loader.loading && <Loading />}

        <P color="primary">Детализация по событиям</P>
        <Label level="body-md">{state.employee?.name}</Label>
        <Label level="body-md">
          {state.date?.toLocaleString('ru-RU', {
            timeZone: 'UTC',
            year: '2-digit',
            month: 'short',
            weekday: 'short',
            day: 'numeric',
          })}
        </Label>
        <Row>
          <Label>Карты </Label>
          <Label xs>Белая {state.employee?.card}</Label>
          {'|'}
          <Label xs>Черная {state.employee?.access_card ?? 'не задана'}</Label>
        </Row>
      </Stack>

      <Stack sx={{ mt: 2, mb: 2 }}>
        <Table
          borderAxis="bothBetween"
          stripe="odd"
          hoverRow
          size="sm"
          sx={{ width: 'fit-content' }}
        >
          <thead>
            <tr>
              <th>Event ID</th>
              <th>Время</th>
              <th>Источник</th>
            </tr>
          </thead>
          <tbody>
            {state.events.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  style={{ textAlign: 'center', padding: '16px' }}
                >
                  <P level="body-sm" textColor="text.tertiary">
                    Нет событий
                  </P>
                </td>
              </tr>
            ) : (
              state.events.map(event => (
                <tr key={event.id}>
                  <td>{event.id}</td>
                  <td>
                    {new Date(event.timestamp).toLocaleString('ru-RU', {
                      timeZone: 'UTC',
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: false,
                    })}
                  </td>
                  <td>
                    {event.origin != null ? (
                      <Label xs variant="soft" color="primary">
                        {UiEventOrigin[event.origin as EventOrigin] ??
                          'Неизвестно'}
                      </Label>
                    ) : (
                      <P level="body-sm" textColor="text.tertiary">
                        —
                      </P>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Stack>
    </Stack>
  )
})
