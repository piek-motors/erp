import { makeAutoObservable, runInAction } from 'mobx'

const RempvalTime = 10_000

type Notification = {
  id: string
  msg: string
  level: 'err' | 'info'
}

class NotifierStore {
  notifications: Notification[] = []

  constructor() {
    makeAutoObservable(this)
  }

  notify(level: Notification['level'], msg: string) {
    const id = crypto.randomUUID()

    // Add notification immediately
    runInAction(() => {
      this.notifications.push({ msg, level, id })
    })

    // Remove notification after timeout
    setTimeout(() => {
      runInAction(() => {
        this.notifications = this.notifications.filter(each => each.id !== id)
      })
    }, RempvalTime)
  }

  all() {
    return this.notifications
  }

  ok(msg: string) {
    this.notify('info', msg)
  }

  err(msg: string) {
    this.notify('err', msg)
  }
}
export const notifier = new NotifierStore()
