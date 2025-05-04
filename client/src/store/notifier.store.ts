import create from 'zustand'

const RempvalTime = 10_000

type Notification = {
  id: string
  msg: string
  level: 'err' | 'info'
}

interface NotifierStore {
  notifications: Notification[]
  notify(level: Notification['level'], msg: string): void
  all(): Notification[]
}

export const useNotifier = create<NotifierStore>((set, get) => {
  return {
    notifications: [],
    notify(level: Notification['level'], msg: string) {
      const id = crypto.randomUUID()

      setTimeout(() => {
        set(state => ({
          notifications: state.notifications.filter(each => each.id !== id)
        }))
      }, RempvalTime)

      set(state => ({
        notifications: [...state.notifications, { msg: msg, level: level, id }]
      }))
    },
    all() {
      return get().notifications
    }
  }
})
