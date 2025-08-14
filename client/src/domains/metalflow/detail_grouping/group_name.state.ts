import { makeAutoObservable } from 'mobx'

export class GroupNameState {
  name: string = ''
  setName(name: string) {
    this.name = name
  }

  modalOpen: boolean = false
  setModalOpen(open: boolean) {
    this.modalOpen = open
  }

  constructor() {
    makeAutoObservable(this)
  }
}
