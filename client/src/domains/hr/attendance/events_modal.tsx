import { Modal, ModalClose, ModalDialog, Stack } from '@mui/joy'
import { makeAutoObservable } from 'mobx'
import { observer } from 'mobx-react-lite'
import { Label, Loading, P, Row } from '@/lib'
import { rpc } from '@/lib/deps'
import { LoadingController } from '@/lib/store/loading_controller'
import type { Employee } from '@/server/domains/hr/attendance/report_generator'

interface Event {
  id: number
  timestamp: string
}

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

  events: Event[] = []

  async load() {
    this.events = []

    const events = await this.loader.run(() =>
      rpc.hr.attendance.get_employee_events.query({
        cards: [this.employee?.card!],
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
      <ModalDialog>
        <ModalClose />
        <P>Детализация по событиям</P>
        <Label>{employee_model_vm.employee?.name}</Label>
        <Label>{employee_model_vm.date?.toDateString()}</Label>
        {employee_model_vm.loader.loading && <Loading />}
        <Stack pr={2}>
          {employee_model_vm.events.map(each => (
            <Row>
              <Label xs>{each.id}</Label>
              <Label>
                {' '}
                {new Date(each.timestamp).toLocaleString('ru-RU', {
                  timeZone: 'UTC',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: false,
                })}
              </Label>
            </Row>
          ))}
        </Stack>
      </ModalDialog>
    </Modal>
  )
})
