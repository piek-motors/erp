import { makeAutoObservable, reaction } from 'mobx'
import type { MaterialShape } from 'models'
import { app_cache } from '@/domains/pdo/cache'
import { LoadingController } from '@/lib/store/loading_controller'
import { debounce } from '@/lib/utils/debounce'
import { normalize, token_search } from '@/lib/utils/search'
import type { MaterialRes } from '@/server/domains/pdo/materials_rpc'

export class MaterialListStore {
  readonly async = new LoadingController()

  search_query: string = ''
  shape_filter: MaterialShape | null = null
  search_result: MaterialRes[] = []

  debouncedFilter: () => void
  constructor() {
    makeAutoObservable(this)
    this.debouncedFilter = debounce(this.filter.bind(this), 300)

    reaction(
      () => app_cache.materials.getMaterials(),
      () => this.filter(),
    )
  }

  private filter() {
    const query = normalize(this.search_query)
    let items = app_cache.materials.getMaterials()

    if (this.shape_filter != null) {
      items = items.filter(m => m.shape === this.shape_filter)
    }

    if (query) {
      items = token_search(items, query, {
        fields: [
          {
            get: (m: MaterialRes) => m.label,
            weight: 2,
          },
          {
            get: (m: MaterialRes) => m.id.toString(),
            weight: 1,
            match: 'exact',
          },
        ],
      })
    }

    this.search_result = items
  }

  set_search_query(keyword: string) {
    this.search_query = keyword
    this.debouncedFilter()
  }

  set_shape_filter(shape: MaterialShape | null) {
    this.shape_filter = shape
    this.filter()
  }

  clear() {
    this.search_query = ''
    this.async.reset()
  }
}

export const materialListStore = new MaterialListStore()
