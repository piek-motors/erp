import { makeAutoObservable, reaction } from 'mobx'
import {
  PaginatedSearchStore,
  type SearchFilters,
} from '@/components/search-paginated'
import { app_cache } from '@/domains/pdo/cache'
import { LoadingController } from '@/lib/store/loading_controller'
import { debounce } from '@/lib/utils/debounce'
import {
  type CriteriaBasedSearchConfig,
  normalize,
  token_search,
} from '@/lib/utils/search'
import type { AppDetail } from '../../cache/detail_cache'

export enum SearchCriteria {
  Id = '№',
  Name = 'Наим.',
  DrawingNumber = 'Чертеж',
}

type CriteriaMatcher = (details: AppDetail[], query: string) => AppDetail[]

export class DetailListStore {
  readonly loader = new LoadingController()
  readonly searchStore: PaginatedSearchStore<AppDetail>

  search_criteria = SearchCriteria.Name
  query: string = ''
  index_letter: string | null = null

  debouncedFilter: () => void
  constructor() {
    this.searchStore = new PaginatedSearchStore<AppDetail>(
      () => app_cache.details.details,
      {
        pageSize: 50,
        customFilter: this.filter_details.bind(this),
      },
    )
    makeAutoObservable(this)
    this.debouncedFilter = debounce(() => this.searchStore.search(), 300)
    reaction(
      () => app_cache.details.details,
      details => details && this.searchStore.search(),
    )
  }

  set_search_criteria(c: SearchCriteria) {
    this.search_criteria = c
    this.searchStore.search()
  }

  set_query(q: string) {
    this.query = q
    this.debouncedFilter()
  }

  set_index_letter(letter: string) {
    this.index_letter = this.index_letter === letter ? null : letter
    this.searchStore.search()
  }

  clear() {
    this.query = ''
    this.index_letter = null
    this.searchStore.clear()
  }

  private filter_details(
    details: AppDetail[],
    _filters: SearchFilters,
  ): AppDetail[] {
    this.searchStore.setIsSearching(true)

    let result = details

    // Alphabetical index filter is orthogonal
    if (this.index_letter) {
      result = result.filter(
        d => d.name.charAt(0).toUpperCase() === this.index_letter,
      )
    }

    // Criteria-based search
    if (this.query) {
      const norm_query = normalize(this.query)
      result = token_search(
        result,
        norm_query,
        search_config[this.search_criteria],
      )
    }

    return result
  }

  get displayed_results() {
    return this.searchStore.displayedResults
  }
}

const search_config: CriteriaBasedSearchConfig<AppDetail, SearchCriteria> = {
  [SearchCriteria.Name]: {
    fields: [
      {
        get: d => d.normalized_name,
      },
      {
        get: d => (app_cache.groups.name_for(d.group_id) ?? '').toLowerCase(),
      },
    ],
  },
  [SearchCriteria.Id]: {
    fields: [
      {
        get: d => d.id.toString(),
        match: 'exact',
      },
    ],
  },
  [SearchCriteria.DrawingNumber]: {
    fields: [
      {
        get: d => d.drawing_number ?? '',
        match: 'includes',
      },
    ],
  },
}

export const detailListStore = new DetailListStore()
