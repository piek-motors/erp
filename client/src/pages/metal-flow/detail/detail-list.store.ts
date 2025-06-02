import { Detail } from 'domain-model'
import { makeAutoObservable, reaction } from 'mobx'
import * as api from './detail.api'

export const alphabet = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'.split('')

export class DetailListStore {
  details: Detail[] = []
  searchKeyword: string = ''
  searchResult: Detail[] = []
  indexLetter: string | null = alphabet[0]
  private searchTimeout: NodeJS.Timeout | null = null

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
  }

  search(keyword: string) {
    this.searchKeyword = keyword
    this.indexLetter = null
  }

  updateSearchResult() {
    let filtered = this.details
    if (this.searchKeyword) {
      filtered = filtered.filter(detail =>
        detail.name.toLowerCase().includes(this.searchKeyword.toLowerCase())
      )
    } else {
      if (this.indexLetter) {
        filtered = filtered.filter(detail =>
          detail.name.toUpperCase().startsWith(this.indexLetter!)
        )
      }
    }

    this.searchResult = this.sort(filtered)
  }

  searchByFirstLetter(letter: string) {
    this.indexLetter = letter
    this.searchKeyword = ''
    this.updateSearchResult()
  }

  setDetails(details: Detail[]) {
    this.details = details
    this.updateSearchResult()
  }

  async deleteDetail(id: number) {
    await api.deleteDetail(id)
    this.details = this.details.filter(d => d.id !== id)
    this.updateSearchResult()
  }

  clear() {
    this.details = []
    this.searchKeyword = ''
    this.searchResult = []
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout)
      this.searchTimeout = null
    }
  }

  async init() {
    const details = await api.getDetails()
    this.setDetails(details)
  }

  sort(filterResult: Detail[]) {
    return filterResult
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name, 'ru'))
  }
}
