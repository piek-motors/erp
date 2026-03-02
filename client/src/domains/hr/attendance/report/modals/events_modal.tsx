import { Modal, ModalClose, ModalDialog } from '@mui/joy'
import { makeAutoObservable } from 'mobx'
import { observer } from 'mobx-react-lite'
import { LoadingController } from '@/lib/store/loading_controller'
import type { Employee } from '@/server/domains/hr/attendance/report_generator'
import { EmployeeEvents } from './employee_events'

class EmployeeModalVM {
  readonly loader = new LoadingController()

  employee: Employee | null = null
  date: Date | null = null

  constructor() {
    makeAutoObservable(this)
  }

  get is_open() {
    return !!this.employee && !!this.date
  }

  open(employee: Employee, date: Date) {
    this.employee = employee
    this.date = date
  }

  close() {
    this.employee = null
    this.date = null
  }
}

const state = new EmployeeModalVM()
export const events_modal_vm = state

export const EmployeeEventsModal = observer(() => {
  return (
    <Modal open={state.is_open} onClose={() => state.close()}>
      <ModalDialog sx={{ minWidth: 600 }}>
        <ModalClose />
        <EmployeeEvents employee={state.employee!} date={state.date!} />
      </ModalDialog>
    </Modal>
  )
})
