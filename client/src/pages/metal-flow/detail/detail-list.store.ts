import { makeAutoObservable } from 'mobx'
import { Detail } from 'domain-model'

export class DetailListStore {
  details: Detail[] = []
  searchResult: number[] = []
  filterKeyword: string = ''

  constructor() {
    makeAutoObservable(this)
  }

  search(keyword: string) {
    this.filterKeyword = keyword
  }

  setDetails(details: Detail[]) {
    this.details = details
  }

  addDetail(detail: Detail) {
    this.details.push(detail)
  }

  clear() {
    this.details = []
    this.filterKeyword = ''
  }
}
