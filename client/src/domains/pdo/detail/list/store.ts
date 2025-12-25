import {
  PaginatedSearchStore,
  SearchFilters
} from 'components/search-paginated'
import { cache } from 'domains/pdo/cache/root'
import { LoadingController } from 'lib/store/loading_controller'
import { makeAutoObservable, runInAction } from 'mobx'
import { DetailSt } from '../detail.state'

export class DetailList {
  readonly loader = new LoadingController()
  readonly searchStore: PaginatedSearchStore<DetailSt>

  constructor() {
    this.searchStore = new PaginatedSearchStore<DetailSt>(
      () => cache.details.details,
      {
        pageSize: 50,
        customFilter: this.filterDetails.bind(this)
      }
    )
    makeAutoObservable(this)
  }

  drawingNumber: string = ''
  indexLetter: string | null = null

  index() {
    this.searchStore.search()
  }

  setKeyword(keyword: string) {
    this.clearSearchArguments()
    this.searchStore.setSearchKeyword(keyword)
  }

  setId(id: string) {
    this.clearSearchArguments()
    this.searchStore.setSearchId(id)
  }

  setDrawingNumber(partCode: string) {
    this.clearSearchArguments()
    this.drawingNumber = partCode
  }

  setIndexLetter(letter: string) {
    if (this.indexLetter === letter) {
      this.indexLetter = null
      this.searchStore.search()
      return
    }
    this.clearSearchArguments()
    this.indexLetter = letter
  }

  // Custom filter function for the search store
  private filterDetails(
    details: DetailSt[],
    filters: SearchFilters
  ): DetailSt[] {
    this.searchStore.setIsSearching(true)
    // Handle built-in filters first (keyword, id)
    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase()
      return details.filter(detail =>
        detail.name.toLowerCase().includes(keyword)
      )
    }

    if (filters.id) {
      return details.filter(detail => detail.id?.toString() === filters.id)
    }

    // Handle custom filters (partCode, indexLetter)
    if (this.drawingNumber) {
      const partCode = this.drawingNumber.toLowerCase()
      return details.filter(
        detail =>
          detail.drawingNumber &&
          detail.drawingNumber.toLowerCase().startsWith(partCode)
      )
    }

    if (this.indexLetter) {
      return details.filter(
        detail => detail.name.charAt(0).toUpperCase() === this.indexLetter
      )
    }

    return details
  }

  private clearSearchArguments() {
    runInAction(() => {
      this.drawingNumber = ''
      this.searchStore.clear()
      this.indexLetter = null
    })
  }

  get displayedResults() {
    return this.searchStore.displayedResults
  }
  get searchKeyword() {
    return this.searchStore.searchFilters.keyword
  }
  get searchId() {
    return this.searchStore.searchFilters.id
  }
}

export const detailListStore = new DetailList()
