import { UilExchange } from '@iconscout/react-unicons'
import { Divider, IconButton, Modal, ModalClose, ModalDialog } from '@mui/joy'
import { rpc } from 'lib/deps'
import { Inp, P, Row, SaveIconButton, UseIcon } from 'lib/index'
import { convertDateToUTC } from 'lib/utils/date_fmt'
import { makeAutoObservable } from 'mobx'
import { observer } from 'mobx-react-lite'
import { Interval } from 'srv/service/attendance_report.generator'
import { store } from './store'

export interface UpdateIntervalMetadata {
  employee: string
  day: number
  month: string
}

class State {
  constructor() {
    makeAutoObservable(this)
  }

  interval?: Interval
  intervalDate?: Date | null

  meta?: UpdateIntervalMetadata

  open(interval: Interval, meta: this['meta']) {
    this.interval = interval
    this.meta = meta
    this.intervalDate = interval.ent ?? interval.ext
    this.ent = fmtDateToHoursAndMinutes(interval.ent)
    this.ext = fmtDateToHoursAndMinutes(interval.ext)
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

  close() {
    this.interval = undefined
    this.meta = undefined
  }

  async save() {
    if (!this.interval || !this.intervalDate) {
      throw Error('Interval is not set')
    }
    if (!this.ent || !this.ext) {
      throw Error('ent or ext is not set')
    }
    await rpc.attendance.update_interval.mutate({
      ent_event_id: this.interval.ent_event_id,
      ent: upTimeAndMinutesOnDate(this.intervalDate, this.ent),
      ext: upTimeAndMinutesOnDate(this.intervalDate, this.ext)
    })
    store.load()
    store.setUpdatedIntervalId(this.interval.ent_event_id)
    this.close()
  }
}

const state = new State()
export const updateIntervalModalState = state

export const UpdateIntervalModal = observer(() => (
  <Modal open={!!state.interval} onClose={() => state.close()}>
    <ModalDialog>
      <ModalClose />
      <P>
        {state.meta?.day} {state.meta?.month}
      </P>
      <P>{state.meta?.employee}</P>
      <Divider />
      <Row alignItems={'end'}>
        <Inp
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
        <Inp
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

export function fmtDateToHoursAndMinutes(d?: Date | null): string {
  if (!d) return ''
  return new Intl.DateTimeFormat('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC'
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

  const newDate = convertDateToUTC(d)
  newDate.setHours(hours, minutes, 0, 0)
  return newDate.toISOString()
}
