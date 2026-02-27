import { Divider, Modal, ModalClose, ModalDialog, Stack, Table } from '@mui/joy'
import { makeAutoObservable } from 'mobx'
import { observer } from 'mobx-react-lite'
import { Label, Loading, P } from '@/lib'
import { rpc } from '@/lib/deps'
import { LoadingController } from '@/lib/store/loading_controller'
import type { Employee } from '@/server/domains/hr/attendance/report_generator'
import { EventOriginTranslation } from 'models'
import { RouterOutput } from '@/server/lib/trpc'

class EmployeeModalVM {
  readonly loader = new LoadingController()

  employee: Employee | null = null
  date: Date | null = null

  constructor() {
    makeAutoObservable(this)
  }

  get is_open() {
    return !!this.employee
  }

  open(employee: Employee, date: Date) {
    this.employee = employee
    this.date = date
    this.load()
  }

  close() {
    this.employee = null
  }

  events: RouterOutput['hr']['attendance']['get_employee_events'] = []

  async load() {
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

export const employee_model_vm = new EmployeeModalVM()

export const EmployeeEventsModal = observer(() => {
  return (
    <Modal
      open={employee_model_vm.is_open}
      onClose={() => employee_model_vm.close()}
    >
      <ModalDialog sx={{ minWidth: 600 }}>
        <ModalClose />
        <Stack gap={0}>
          <P>Детализация по событиям</P>
          <Label>{employee_model_vm.employee?.name}</Label>
          <Label>
            {employee_model_vm.date?.toLocaleString('ru-RU', {
              timeZone: 'UTC',
              year: '2-digit',
              month: 'short',
              day: '2-digit',
            })}
          </Label>
        </Stack>
        <Divider />
        {employee_model_vm.loader.loading && <Loading />}
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
              {employee_model_vm.events.length === 0 ? (
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
                employee_model_vm.events.map(event => (
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
                          {EventOriginTranslation[event.origin]}
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
      </ModalDialog>
    </Modal>
  )
})
