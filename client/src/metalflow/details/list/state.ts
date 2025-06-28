import { AsyncStoreController } from 'lib/async-store.controller'
import { rpc } from 'lib/rpc.client'
import { makeAutoObservable, reaction } from 'mobx'
import { Detail, MaterialCost } from '../detail.store'

export const alphabet = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'.split('')

export class DetailList {
  readonly async = new AsyncStoreController()

  details: Detail[] = []
  searchKeyword: string = ''
  searchId: string = ''
  searchResult: Detail[] = []
  indexLetter: string | null = alphabet[0]
  private searchTimeout: NodeJS.Timeout | null = null
  private searchIdTimeout: NodeJS.Timeout | null = null

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
  }

  search(keyword: string) {
    this.clearSearchArguments()
    this.searchKeyword = keyword
  }

  setSearchId(id: string) {
    this.clearSearchArguments()
    this.searchId = id
  }

  updateSearchResult() {
    let filtered = this.details
    switch (true) {
      case Boolean(this.searchKeyword):
        filtered = filtered.filter(detail =>
          detail.name.toLowerCase().includes(this.searchKeyword.toLowerCase())
        )
        break
      case Boolean(this.searchId):
        filtered = filtered.filter(detail =>
          detail.id?.toString().startsWith(this.searchId)
        )
        break
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

  private setDetails(details: Detail[]) {
    this.details = details
    this.updateSearchResult()
  }

  async deleteDetail(id: number) {
    await rpc.details.delete.mutate({ id })
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
    if (this.searchIdTimeout) {
      clearTimeout(this.searchIdTimeout)
      this.searchIdTimeout = null
    }
    this.async.reset()
  }

  clearSearchArguments() {
    this.searchKeyword = ''
    this.searchId = ''
    this.indexLetter = null
  }

  async init() {
    return this.async.run(async () => {
      const details = await rpc.details.list.query()
      this.setDetails(
        details.map(detail => {
          return new Detail({
            id: detail[0] as number,
            name: detail[1] as string,
            partCode: detail[2] as string,
            usedMaterials: (
              detail[3] as [number, string, number, number][]
            ).map(e => {
              return new MaterialCost({
                materialId: e[0],
                label: e[1],
                length: e[2].toString(),
                weight: e[3].toString()
              })
            })
          })
        })
      )
    })
  }

  sort(filterResult: Detail[]) {
    return filterResult
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name, 'ru'))
  }
}

export const detailListStore = new DetailList()
