import { WebOnly } from '@/components/utilities/conditional-display'
import { rpc } from '@/lib/deps'
import {
  InputLabled,
  Label,
  P,
  Row,
  SaveIconButton,
  UseIcon,
} from '@/lib/index'
import {
  Employee,
  Interval,
} from '@/server/domains/attendance/report_generator'
import { UilExchange } from '@iconscout/react-unicons'
import {
  Button,
  Divider,
  IconButton,
  Modal,
  ModalClose,
  ModalDialog,
  Stack,
} from '@mui/joy'
import { makeAutoObservable } from 'mobx'
import { observer } from 'mobx-react-lite'
import type { AbsenceReason } from 'models'
import { AbsenceReasons, absenceReasonState } from './absence'
import { store } from './store'

export interface UpdateIntervalMetadata {
  employee: Employee
  date: Date
  month: string
}

class State {
  constructor() {
    makeAutoObservable(this)
  }
  interval?: Interval
  intervalDate?: Date | null
  meta?: UpdateIntervalMetadata

  open(meta: this['meta'], interval?: Interval) {
    // reset
    this.ent = undefined
    this.ext = undefined

    this.interval = interval
    this.meta = meta
    this.intervalDate = meta?.date
    if (interval) {
      this.ent = fmtDateToHoursAndMinutes(interval.ent)
      this.ext = fmtDateToHoursAndMinutes(interval.ext)
    }
  }

  ent?: string
  setEnt(v: string) {
    this.ent = v
  }
  ext?: string
  setExt(v: string) {
    this.ext = v
  }

  swapEntAndExt() {
    const c = this.ent
    this.ent = this.ext
    this.ext = c
  }

  generateRandomEntEventId(): number {
    const min = 1e9 // one milliard
    const max = 2147483647
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  close() {
    this.interval = undefined
    this.meta = undefined
    this.intervalDate = undefined
  }

  async save() {
    if (!this.intervalDate) {
      throw Error('Interval is not set')
    }
    if (!this.ent || !this.ext) {
      throw Error('ent or ext is not set')
    }

    const [ent, ext] = [this.ent, this.ext].map(each =>
      upTimeAndMinutesOnDate(this.intervalDate!, each),
    )

    if (this.interval?.ent_event_id) {
      await rpc.attendance.update_interval.mutate({
        ent_event_id: this.interval?.ent_event_id,
        ent,
        ext,
      })
    } else {
      await rpc.attendance.insert_interval.mutate({
        card: this.meta?.employee.card!,
        ent_event_id: this.generateRandomEntEventId(),
        ent,
        ext,
      })
    }

    store.load()
    this.close()
  }
}

const state = new State()
export const updateIntervalModalState = state

export const UpdateIntervalModal = observer(() => (
  <Modal open={!!state.intervalDate} onClose={() => state.close()}>
    <ModalDialog>
      <ModalClose />
      <P>
        {state.meta?.date.getDate()} {state.meta?.month}
      </P>
      <P>{state.meta?.employee.name}</P>
      <Divider />
      {!state.interval && (
        <>
          <Stack gap={1}>
            <Label>Причина отсутствия</Label>
            <AbsenceReasons onClick={() => state.close()} />
          </Stack>
          <Divider />
        </>
      )}
      <Row alignItems={'end'}>
        <InputLabled
          value={state.ent}
          onChange={v => state.setEnt(v)}
          label="Приход"
          sx={{ width: 100 }}
        />
        <IconButton
          sx={{ width: 'min-content' }}
          size="sm"
          variant="outlined"
          onClick={() => state.swapEntAndExt()}
        >
          <UseIcon icon={UilExchange} />
        </IconButton>
        <InputLabled
          value={state.ext}
          onChange={v => state.setExt(v)}
          label="Уход"
          sx={{ width: 100 }}
        />
      </Row>
      <SaveIconButton onClick={() => state.save()} />
    </ModalDialog>
  </Modal>
))

export const UpdateIntervalButton = observer(
  ({
    data,
    meta,
    onReasonSet,
  }: {
    data: Employee['days'][number]
    meta: UpdateIntervalMetadata
    onReasonSet: (r: AbsenceReason) => void
  }) => {
    if (meta.date > new Date()) return null
    if (
      (data.broken && data.intervals.length === 1) ||
      data.intervals.length === 0 ||
      data.intervals.some(i => i.updated_manually)
    ) {
      return (
        <WebOnly>
          <Button
            variant={data.broken ? 'solid' : 'soft'}
            color={data.broken ? 'danger' : 'primary'}
            size="sm"
            sx={{
              opacity: 0.6,
              width: 'min-content',
              m: '0 auto',
              height: '20px',
              widows: '30px',
              fontSize: '1rem',
              minHeight: 'min-content',
            }}
            onClick={() => {
              updateIntervalModalState.open(meta, data.intervals.at(0))
              absenceReasonState.open({
                date: meta.date,
                employeeId: meta.employee.id,
                onReasonSet,
              })
            }}
          >
            +
          </Button>
        </WebOnly>
      )
    }
  },
)

export function fmtDateToHoursAndMinutes(d?: Date | null): string {
  if (!d) return ''
  return new Intl.DateTimeFormat('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
  }).format(new Date(d))
}

function upTimeAndMinutesOnDate(d: Date, newTime: string): string {
  if (!d || !newTime) {
    throw Error('invalid arguments')
  }

  const [hours, minutes] = newTime.split(':').map(Number)
  if (isNaN(hours) || isNaN(minutes)) {
    throw Error('invalid time')
  }

  const newDate = new Date(d)
  newDate.setUTCHours(hours, minutes, 0, 0)
  return newDate.toISOString()
}
