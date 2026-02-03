import { debounceMs } from 'lib/constants'
import { makeAutoObservable, reaction, runInAction } from 'mobx'
import { sort_rus } from 'models'

export interface SearchableItem {
  id?: number
  name: string
}

export interface SearchFilters {
  keyword?: string
  id?: string
  [key: string]: any
}

export class PaginatedSearchStore<T extends SearchableItem> {
  searchFilters: SearchFilters = {}
  searchResult: T[] = []
  displayedResults: T[] = []
  isSearching: boolean = false
  setIsSearching(value: boolean) {
    this.isSearching = value
  }

  // Pagination properties
  pageSize: number = 50
  currentPage: number = 1
  hasMore: boolean = false

  private searchTimeout: NodeJS.Timeout | null = null
  private getItemsFn: () => T[]
  private customFilterFn?: (items: T[], filters: SearchFilters) => T[]

  constructor(
    getItems: () => T[],
    options: {
      pageSize?: number
      customFilter?: (items: T[], filters: SearchFilters) => T[]
    } = {},
  ) {
    const { pageSize = 50, customFilter } = options

    this.getItemsFn = getItems
    this.pageSize = pageSize
    this.customFilterFn = customFilter

    makeAutoObservable(this)

    // Debounced search reaction
    reaction(
      () => this.searchFilters,
      () => {
        this.setIsSearching(true)
        if (this.searchTimeout) {
          clearTimeout(this.searchTimeout)
        }
        this.searchTimeout = setTimeout(() => {
          this.search()
        }, debounceMs)
      },
    )
  }

  setSearchFilter(key: string, value: any) {
    this.searchFilters = { ...this.searchFilters, [key]: value }
  }

  setSearchKeyword(keyword: string) {
    this.clearFilters()
    this.setSearchFilter('keyword', keyword)
  }

  setSearchId(id: string) {
    this.clearFilters()
    this.setSearchFilter('id', id)
  }

  clearFilters() {
    this.searchFilters = {}
  }

  loadMore() {
    this.currentPage += 1
    this.updateDisplayedResults()
  }

  private updateDisplayedResults() {
    const totalToShow = this.currentPage * this.pageSize
    runInAction(() => {
      this.displayedResults = this.searchResult.slice(0, totalToShow)
      this.hasMore = this.searchResult.length > totalToShow
    })
  }

  private resetPagination() {
    this.currentPage = 1
    this.hasMore = false
    this.displayedResults = []
  }

  search() {
    const items = this.getItemsFn()

    if (items.length === 0) {
      runInAction(() => {
        this.searchResult = []
        this.setIsSearching(false)
        this.resetPagination()
      })
      return
    }

    this.resetPagination()
    if (items.length > 500) {
      this.searchInChunks(items)
    } else {
      this.searchImmediate(items)
    }
  }

  private searchImmediate(items: T[]) {
    const filtered = this.filterItems(items)
    const sorted = sort_rus(filtered, v => v.name)

    runInAction(() => {
      this.searchResult = sorted
      this.setIsSearching(false)
      this.updateDisplayedResults()
    })
  }

  private searchInChunks(items: T[]) {
    const chunkSize = 200
    let currentIndex = 0
    const filteredResults: T[] = []

    const processChunk = () => {
      const endIndex = Math.min(currentIndex + chunkSize, items.length)
      const chunk = items.slice(currentIndex, endIndex)

      const filteredChunk = this.filterItems(chunk)
      filteredResults.push(...filteredChunk)

      currentIndex = endIndex

      if (currentIndex < items.length) {
        requestAnimationFrame(processChunk)
      } else {
        const sorted = sort_rus(filteredResults, v => v.name)
        runInAction(() => {
          this.searchResult = sorted
          this.setIsSearching(false)
          this.updateDisplayedResults()
        })
      }
    }

    requestAnimationFrame(processChunk)
  }

  private filterItems(items: T[]): T[] {
    // Use custom filter if provided
    if (this.customFilterFn) {
      return this.customFilterFn(items, this.searchFilters)
    }

    // Default filtering logic
    if (Object.keys(this.searchFilters).length === 0) {
      return items
    }

    return items.filter(item => {
      // Search by ID
      if (this.searchFilters.id) {
        return item.id?.toString() === this.searchFilters.id
      }

      // Search by keyword
      if (this.searchFilters.keyword) {
        const keyword = this.searchFilters.keyword.toLowerCase()
        return item.name.toLowerCase().includes(keyword)
      }

      return true
    })
  }

  clear() {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout)
      this.searchTimeout = null
    }
    this.clearFilters()
    this.searchResult = []
    this.setIsSearching(false)
    this.resetPagination()
  }
}
