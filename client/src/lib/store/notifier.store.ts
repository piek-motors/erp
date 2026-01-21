import { AlertProps } from '@mui/joy'
import { makeAutoObservable, runInAction } from 'mobx'

const ErrMsgTime = 10_000
const OkMsgTime = 3_000

type Notification = {
  id: string
  msg: string
  color: AlertProps['color']
}

class NotifierStore {
  notifications: Notification[] = []

  constructor() {
    makeAutoObservable(this)
  }

  private notify(level: Notification['color'], msg: string, timeout?: number) {
    const id = crypto.randomUUID()

    runInAction(() => {
      this.notifications.unshift({ msg, color: level, id })
    })

    // Remove notification after timeout
    setTimeout(() => {
      runInAction(() => {
        this.notifications = this.notifications.filter(each => each.id !== id)
      })
    }, timeout || ErrMsgTime)
  }

  all() {
    return this.notifications
  }

  ok(msg: string) {
    this.notify('success', msg, OkMsgTime)
  }

  warn(msg: string) {
    this.notify('warning', msg, OkMsgTime)
  }

  err(msg: string) {
    this.notify('danger', msg, ErrMsgTime)
  }
}
export const notifier = new NotifierStore()
