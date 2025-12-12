import { Button } from '@mui/joy'
import { rpc } from 'lib/deps'
import { Row } from 'lib/index'
import { makeAutoObservable } from 'mobx'
import { observer } from 'mobx-react-lite'
import { AbsenceReason } from 'models'

type OpenParams = {
  employeeId: number
  date: Date
  onReasonSet: (r: AbsenceReason) => void
}

class AbsenceReasonMenuState {
  constructor() {
    makeAutoObservable(this)
  }

  isOpen: boolean = false
  setOpen(v: boolean) {
    this.isOpen = false
  }

  openParams?: OpenParams
  open(params: OpenParams) {
    this.isOpen = true
    this.openParams = params
  }

  async setReason(reason: AbsenceReason) {
    if (!this.openParams) {
      throw new Error('open params is not set')
    }
    await rpc.attendance.set_absence_reason.mutate({
      user_id: this.openParams.employeeId,
      date: this.openParams.date.toISOString().split('T')[0],
      reason
    })
    this.setOpen(false)
    this.openParams.onReasonSet(reason)
  }
}

const state = new AbsenceReasonMenuState()
export const absenceReasonState = state

export const AbsenceReasons = observer((props: { onClick: () => void }) => (
  <Row gap={0.5}>
    {Object.values(AbsenceReason).map(reason => (
      <Button
        variant="outlined"
        color="neutral"
        size="sm"
        onClick={() => {
          state.setReason(reason)
          props.onClick()
        }}
      >
        {reason}
      </Button>
    ))}
  </Row>
))
