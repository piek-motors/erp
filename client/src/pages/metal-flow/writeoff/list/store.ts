import { Writeoff } from 'domain-model'
import { makeAutoObservable } from 'mobx'
import { WriteoffApi } from '../writeoff.api'

export class WriteoffListStore {
  private api = new WriteoffApi()

  writeoffs: Writeoff[] = []
  setWriteoffs(writeoffs: Writeoff[]) {
    this.writeoffs = writeoffs
  }

  constructor() {
    makeAutoObservable(this)
  }

  async load() {
    const writeoffs = await this.api.list()
    this.setWriteoffs(writeoffs)
  }
}
