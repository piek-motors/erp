import { Button } from '@mui/joy'
import Menu from '@mui/joy/Menu'
import { WebOnly } from 'components/utilities/conditional-display'
import { P } from 'lib'
import { rpc } from 'lib/deps'
import { makeAutoObservable } from 'mobx'
import { observer } from 'mobx-react-lite'
import { AbsenceReason } from 'models'

type OpenParams = {
  userId: number
  date: Date
  anchorEl: HTMLElement
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
      user_id: this.openParams.userId,
      date: this.openParams.date.toISOString().split('T')[0],
      reason
    })
    this.setOpen(false)
    this.openParams.onReasonSet(reason)
  }
}

const state = new AbsenceReasonMenuState()

export const AbseceReasonMenu = observer(() => {
  return (
    <Menu
      size="sm"
      open={state.isOpen}
      onMouseLeave={() => state.setOpen(false)}
      onClose={() => state.setOpen(false)}
      sx={{ display: 'flex', flexDirection: 'row', gap: 0.5, px: 1 }}
      anchorEl={state.openParams?.anchorEl}
    >
      {Object.values(AbsenceReason).map(reason => (
        <Button
          variant="soft"
          color="neutral"
          size="sm"
          onClick={() => state.setReason(reason)}
        >
          {reason}
        </Button>
      ))}
    </Menu>
  )
})

export const OpenAbsenceReasonButton = observer(
  (props: Omit<OpenParams, 'anchorEl'>) => {
    if (props.date >= new Date()) return null
    return (
      <Button
        variant="plain"
        color="neutral"
        size="sm"
        sx={{ opacity: 0.5, m: '0 auto' }}
        onClick={e =>
          state.open({
            ...props,
            anchorEl: e.currentTarget
          })
        }
      >
        +
      </Button>
    )
  }
)

type AbsenceSectionProps = {
  hasIntervals: boolean
  absence?: AbsenceReason
  employeeId: number
  date: Date
  onReasonSet: (reason: AbsenceReason) => void
}

export const AbsenceSection = observer((props: AbsenceSectionProps) => {
  if (props.hasIntervals) return null
  return (
    <>
      {!props.absence ? (
        <WebOnly>
          <OpenAbsenceReasonButton
            userId={props.employeeId}
            date={props.date}
            onReasonSet={props.onReasonSet}
          />
        </WebOnly>
      ) : (
        <P textAlign={'center'} color="danger" level="body-sm" fontWeight={600}>
          {props.absence}
        </P>
      )}
    </>
  )
})
