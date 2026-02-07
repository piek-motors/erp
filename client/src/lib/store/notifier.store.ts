import type { AlertProps } from '@mui/joy'
import { makeAutoObservable, runInAction } from 'mobx'
import { Second } from '@/lib/constants'

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

  private notify(
    level: Notification['color'],
    msg: string,
    timeout_sec: number,
  ) {
    const id = crypto.randomUUID()

    runInAction(() => {
      this.notifications.unshift({ msg, color: level, id })
    })

    // Remove notification after timeout
    setTimeout(() => {
      runInAction(() => {
        this.notifications = this.notifications.filter(each => each.id !== id)
      })
    }, timeout_sec * Second)
  }

  all() {
    return this.notifications
  }

  ok(msg: string, timeout_sec?: number) {
    this.notify('success', msg, timeout_sec || 3)
  }

  warn(msg: string, timeout_sec?: number) {
    this.notify('warning', msg, timeout_sec || 5)
  }

  err(msg: string, timeout_sec?: number) {
    this.notify('danger', msg, timeout_sec || 10)
  }
}
export const notifier = new NotifierStore()
