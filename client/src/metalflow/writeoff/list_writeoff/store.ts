import { Writeoff } from 'domain-model'
import { makeAutoObservable } from 'mobx'

export class WriteoffListStore {
  writeoffs: Writeoff[] = []
  setWriteoffs(writeoffs: Writeoff[]) {
    this.writeoffs = writeoffs
  }

  constructor() {
    makeAutoObservable(this)
  }

  set(writeoffs: Writeoff[]) {
    this.writeoffs = writeoffs
  }

  delete(id: number) {
    this.writeoffs = this.writeoffs.filter(w => w.id !== id)
  }
}
