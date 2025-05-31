import { Detail } from 'domain-model'
import { makeAutoObservable } from 'mobx'

export class DetailListStore {
  details: Detail[] = []
  searchResult: number[] = []
  searchKeyword: string = ''

  constructor() {
    makeAutoObservable(this)
  }

  search(keyword: string) {
    this.searchKeyword = keyword
  }

  setDetails(details: Detail[]) {
    this.details = details
  }

  addDetail(detail: Detail) {
    this.details.push(detail)
  }

  clear() {
    this.details = []
    this.searchKeyword = ''
  }
}
