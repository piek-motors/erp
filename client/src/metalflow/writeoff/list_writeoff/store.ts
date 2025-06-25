import { EnWriteoffReason } from 'domain-model'
import { makeAutoObservable } from 'mobx'
import { RouterOutput } from '../../../../../server/src/lib/trpc'

export type ListWriteoffDto = RouterOutput['material']['listWriteoff'][number]

export interface Writeoff {
  id: number
  qty: number
  timestamp: Date
  data: {
    reason: EnWriteoffReason
  }
}

export class WriteoffListStore {
  writeoffs: ListWriteoffDto[] = []

  constructor() {
    makeAutoObservable(this)
  }

  setWriteoffs(writeoffs: ListWriteoffDto[]) {
    this.writeoffs = writeoffs
  }

  set(writeoffs: ListWriteoffDto[]) {
    this.writeoffs = writeoffs
  }

  delete(id: number) {
    this.writeoffs = this.writeoffs.filter(w => w.id !== id)
  }
}
