import { makeAutoObservable } from 'mobx'
export class AsyncStoreController {
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
  async run<T>(fn: () => Promise<T>) {
    this.setLoading(true)
    try {
      return await fn()
    } catch (error) {
      this.setError(error as Error)
      throw error
    } finally {
      this.setLoading(false)
    }
  }
}
