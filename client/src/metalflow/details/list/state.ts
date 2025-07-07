import { AsyncStoreController } from 'lib/async-store.controller'
import { rpc } from 'lib/rpc.client'
import { cache } from 'metalflow/metal_flow_cache'
import { makeAutoObservable, reaction } from 'mobx'
import { Detail } from '../detail.store'
export const alphabet = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'.split('')
export class DetailList {
  readonly async = new AsyncStoreController()
  searchKeyword: string = ''
  searchId: string = ''
  searchPartCode: string = ''
  searchResult: Detail[] = []
  indexLetter: string | null = alphabet[0]

  private searchTimeout: NodeJS.Timeout | null = null
  private searchIdTimeout: NodeJS.Timeout | null = null
  private searchPartCodeTimeout: NodeJS.Timeout | null = null

  constructor() {
    makeAutoObservable(this)
    // Setup reaction for debounced search updates
    reaction(
      () => this.searchKeyword,
      keyword => {
        if (this.searchTimeout) {
          clearTimeout(this.searchTimeout)
        }
        this.searchTimeout = setTimeout(() => {
          this.updateSearchResult()
        }, 500)
      }
    )
    // Setup reaction for debounced search updates
    reaction(
      () => this.searchId,
      keyword => {
        if (this.searchIdTimeout) {
          clearTimeout(this.searchIdTimeout)
        }
        this.searchIdTimeout = setTimeout(() => {
          this.updateSearchResult()
        }, 500)
      }
    )
    // Setup reaction for debounced part code search updates
    reaction(
      () => this.searchPartCode,
      partCode => {
        if (this.searchPartCodeTimeout) {
          clearTimeout(this.searchPartCodeTimeout)
        }
        this.searchPartCodeTimeout = setTimeout(() => {
          this.updateSearchResult()
        }, 500)
      }
    )
  }

  search(keyword: string) {
    this.clearSearchArguments()
    this.searchKeyword = keyword
  }
  setSearchId(id: string) {
    this.clearSearchArguments()
    this.searchId = id
  }
  setSearchPartCode(partCode: string) {
    this.clearSearchArguments()
    this.searchPartCode = partCode
  }
  updateSearchResult() {
    let filtered = cache.details.getDetails()
    switch (true) {
      case Boolean(this.searchKeyword):
        filtered = filtered.filter(detail =>
          detail.name.toLowerCase().includes(this.searchKeyword.toLowerCase())
        )
        break
      case Boolean(this.searchId):
        filtered = filtered.filter(
          detail => detail.id?.toString() === this.searchId
        )
        break
      case Boolean(this.searchPartCode): {
        const x = this.searchPartCode.toLowerCase().trim()
        filtered = filtered.filter(detail => {
          if (!detail.partCode) return false

          return detail.partCode.toLowerCase().trim().startsWith(x)
        })
        break
      }
      case Boolean(this.indexLetter):
        filtered = filtered.filter(detail =>
          detail.name.toUpperCase().startsWith(this.indexLetter!)
        )
        break
    }
    this.searchResult = this.sort(filtered)
  }
  searchByFirstLetter(letter: string) {
    this.indexLetter = letter
    this.searchKeyword = ''
    this.updateSearchResult()
  }
  async deleteDetail(id: number) {
    await rpc.metal.details.delete.mutate({ id })
    cache.details.removeDetail(id)
    this.updateSearchResult()
  }
  clear() {
    this.searchKeyword = ''
    this.searchPartCode = ''
    this.searchResult = []
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout)
      this.searchTimeout = null
    }
    if (this.searchIdTimeout) {
      clearTimeout(this.searchIdTimeout)
      this.searchIdTimeout = null
    }
    if (this.searchPartCodeTimeout) {
      clearTimeout(this.searchPartCodeTimeout)
      this.searchPartCodeTimeout = null
    }
    this.async.reset()
  }
  clearSearchArguments() {
    this.searchKeyword = ''
    this.searchId = ''
    this.searchPartCode = ''
    this.indexLetter = null
  }
  sort(filterResult: Detail[]) {
    return filterResult
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name, 'ru'))
  }
}
export const detailListStore = new DetailList()
