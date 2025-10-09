import { makeAutoObservable } from 'mobx'

export class LoadingController {
  loading: boolean = false
  error: Error | null = null
  constructor() {
    makeAutoObservable(this)
  }
  setLoading(loading: boolean) {
    this.loading = loading
  }
  setError(error: Error | null) {
    this.error = error
  }
  reset() {
    this.loading = false
    this.error = null
  }
  start() {
    this.setLoading(true)
    this.setError(null)
  }
  end() {
    this.setLoading(false)
  }
  async run<T>(fn: () => Promise<T>) {
    this.start()
    try {
      return await fn()
    } catch (error) {
      this.setError(error as Error)
      throw error
    } finally {
      this.end()
    }
  }
}
