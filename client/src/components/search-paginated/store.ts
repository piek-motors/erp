import { debounceMs } from 'lib/constants'
import { action, makeObservable, observable, reaction, runInAction } from 'mobx'

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

  // Pagination properties
  pageSize: number = 50
  currentPage: number = 1
  hasMore: boolean = false

  private searchTimeout: NodeJS.Timeout | null = null
  private searchStartTime: number = 0
  private getItemsFn: () => T[]
  private customFilterFn?: (items: T[], filters: SearchFilters) => T[]

  constructor(
    getItems: () => T[],
    options: {
      pageSize?: number
      customFilter?: (items: T[], filters: SearchFilters) => T[]
    } = {}
  ) {
    const { pageSize = 50, customFilter } = options

    this.getItemsFn = getItems
    this.pageSize = pageSize
    this.customFilterFn = customFilter

    makeObservable(this, {
      searchFilters: observable,
      searchResult: observable,
      displayedResults: observable,
      isSearching: observable,
      pageSize: observable,
      currentPage: observable,
      hasMore: observable,
      setSearchFilter: action,
      setSearchKeyword: action,
      setSearchId: action,
      clearFilters: action,
      loadMore: action,
      search: action,
      clear: action
    })

    // Debounced search reaction
    reaction(
      () => this.searchFilters,
      () => {
        if (this.searchTimeout) {
          clearTimeout(this.searchTimeout)
        }
        this.searchTimeout = setTimeout(() => {
          this.search()
        }, debounceMs)
      }
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
    const searchStartTime = performance.now()
    const items = this.getItemsFn()

    if (items.length === 0) {
      runInAction(() => {
        this.searchResult = []
        this.isSearching = false
        this.resetPagination()
      })
      return
    }

    runInAction(() => {
      this.isSearching = true
      this.resetPagination()
    })

    this.searchStartTime = searchStartTime
    if (items.length > 500) {
      this.searchInChunks(items)
    } else {
      this.searchImmediate(items)
    }
  }

  private searchImmediate(items: T[]) {
    const filtered = this.filterItems(items)
    const sorted = this.sortItems(filtered)

    runInAction(() => {
      this.searchResult = sorted
      this.isSearching = false
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
        const sorted = this.sortItems(filteredResults)
        // statistics
        const searchEndTime = performance.now()
        const totalDuration = searchEndTime - this.searchStartTime
        console.debug('⏱️ Search completed (chunked)', {
          totalDuration: `${totalDuration.toFixed(2)}ms`,
          itemsProcessed: items.length,
          resultCount: sorted.length,
          displayedCount: Math.min(sorted.length, this.pageSize),
          chunksProcessed: Math.ceil(items.length / chunkSize)
        })

        runInAction(() => {
          this.searchResult = sorted
          this.isSearching = false
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

  private sortItems(items: T[]): T[] {
    return items
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name, 'ru', { numeric: true }))
  }

  clear() {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout)
      this.searchTimeout = null
    }
    this.clearFilters()
    this.searchResult = []
    this.isSearching = false
    this.resetPagination()
  }
}
