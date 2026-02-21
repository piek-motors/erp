import { makeAutoObservable, reaction } from 'mobx'
import type { MaterialShape } from 'models'
import { app_cache } from '@/domains/pdo/cache'
import { LoadingController } from '@/lib/store/loading_controller'
import { debounce } from '@/lib/utils/debounce'
import { normalize, type SearchConfig, token_search } from '@/lib/utils/search'
import type { AppMaterial } from '../../cache/material_cache'

export class MaterialListStore {
  readonly async = new LoadingController()

  search_query: string = ''
  shape_filter: MaterialShape | null = null
  search_result: AppMaterial[] = []

  debouncedFilter: () => void
  constructor() {
    makeAutoObservable(this)
    this.debouncedFilter = debounce(this.filter.bind(this), 300)

    reaction(
      () => app_cache.materials.materials,
      () => this.filter(),
    )
  }

  private filter() {
    const norm_query = normalize(this.search_query)
    let items = app_cache.materials.materials

    if (this.shape_filter != null) {
      items = items.filter(m => m.shape === this.shape_filter)
    }

    if (norm_query) {
      items = token_search(items, norm_query, search_config)
    }

    this.search_result = items
  }

  set_search_query(q: string) {
    this.search_query = q
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

const search_config: SearchConfig<AppMaterial> = {
  fields: [
    {
      get: (m: AppMaterial) => m.normalized_label,
      weight: 2,
    },
    {
      get: (m: AppMaterial) => m.id.toString(),
      weight: 1,
      match: 'exact',
    },
  ],
}

export const materialListStore = new MaterialListStore()
