import {
  PaginatedSearchStore,
  SearchFilters
} from 'components/search-paginated'
import { cache } from 'domains/pdo/cache/root'
import { LoadingController } from 'lib/loading_controller'
import { action, makeObservable, observable, runInAction } from 'mobx'
import { DetailState } from '../detail.state'

export const alphabet = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'.split('')

export class DetailList {
  readonly async = new LoadingController()
  searchPartCode: string = ''
  indexLetter: string | null = null

  // Composition: embed the paginated search store
  readonly searchStore: PaginatedSearchStore<DetailState>

  constructor() {
    this.searchStore = new PaginatedSearchStore<DetailState>(
      () => cache.details.getDetails(),
      {
        pageSize: 50,
        customFilter: this.filterDetails.bind(this)
      }
    )

    makeObservable(this, {
      searchPartCode: observable,
      indexLetter: observable,
      setSearchPartCode: action,
      searchByFirstLetter: action
    })
  }

  init() {
    this.searchStore.search()
  }

  // Delegate search methods to the embedded store
  setSearchKeyword(keyword: string) {
    this.clearSearchArguments()
    this.searchStore.setSearchKeyword(keyword)
  }

  setSearchId(id: string) {
    this.clearSearchArguments()
    this.searchStore.setSearchId(id)
  }

  setSearchPartCode(partCode: string) {
    this.clearSearchArguments()
    this.searchPartCode = partCode
    this.searchStore.search() // Trigger search when part code changes
  }

  searchByFirstLetter(letter: string) {
    this.clearSearchArguments()
    this.indexLetter = letter
    this.searchStore.search() // Trigger search when letter changes
  }

  // Custom filter function for the search store
  private filterDetails(
    details: DetailState[],
    filters: SearchFilters
  ): DetailState[] {
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
    if (this.searchPartCode) {
      const partCode = this.searchPartCode.toLowerCase()
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

  clear() {
    this.searchStore.clear()
    this.clearSearchArguments()
    this.async.reset()
  }

  private clearSearchArguments() {
    runInAction(() => {
      this.searchPartCode = ''
      this.searchStore.clear()
      this.indexLetter = null
    })
  }

  // Getters to expose search store properties
  get searchResult() {
    return this.searchStore.searchResult
  }

  get displayedResults() {
    return this.searchStore.displayedResults
  }

  get isSearching() {
    return this.searchStore.isSearching
  }

  get hasMore() {
    return this.searchStore.hasMore
  }

  get searchKeyword() {
    return this.searchStore.searchFilters.keyword || ''
  }

  get searchId() {
    return this.searchStore.searchFilters.id || ''
  }
}

export const detailListStore = new DetailList()
