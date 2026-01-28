import {
	PaginatedSearchStore,
	type SearchFilters,
} from 'components/search-paginated'
import { app_cache } from 'domains/pdo/cache'
import { LoadingController } from 'lib/store/loading_controller'
import { debounce } from 'lib/utils/debounce'
import { makeAutoObservable, reaction } from 'mobx'
import type { DetailSt } from '../detail.state'

export enum DetailSearchCriteria {
	Id = '№',
	Name = 'Наим.',
	DrawingNum = 'Чертеж',
}

type CriteriaMatcher = (details: DetailSt[], query: string) => DetailSt[]

export class DetailListStore {
	readonly loader = new LoadingController()
	readonly searchStore: PaginatedSearchStore<DetailSt>

	search_criteria = DetailSearchCriteria.Name
	query: string = ''
	index_letter: string | null = null

	debouncedFilter: () => void
	constructor() {
		this.searchStore = new PaginatedSearchStore<DetailSt>(
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

	set_search_criteria(c: DetailSearchCriteria) {
		this.search_criteria = c
		this.query = ''
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

	private readonly criteriaMatchers: Record<
		DetailSearchCriteria,
		CriteriaMatcher
	> = {
		[DetailSearchCriteria.Id]: (details, query) =>
			details.filter(d => d.id?.toString() === query),

		[DetailSearchCriteria.Name]: (details, query) => {
			const tokens = query.toLowerCase().split(/\s+/).filter(Boolean)

			if (!tokens.length) return details

			return details
				.map(detail => {
					const name = detail.name.toLowerCase()
					const group = (
						app_cache.detailGroups.getGroupName(detail.groupId) ?? ''
					).toLowerCase()

					let score = 0

					for (const token of tokens) {
						if (name.includes(token)) score += 3
						else if (group.includes(token)) score += 1
						else return null
					}

					return { detail, score }
				})
				.filter((v): v is { detail: DetailSt; score: number } => v !== null)
				.sort((a, b) => b.score - a.score)
				.map(v => v.detail)
		},

		[DetailSearchCriteria.DrawingNum]: (details, query) => {
			const q = query.toLowerCase()
			return details.filter(
				d => d.drawingNumber && d.drawingNumber.toLowerCase().includes(q),
			)
		},
	}

	private filter_details(
		details: DetailSt[],
		_filters: SearchFilters,
	): DetailSt[] {
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
			const matcher = this.criteriaMatchers[this.search_criteria]
			result = matcher(result, this.query)
		}

		return result
	}

	get displayed_results() {
		return this.searchStore.displayedResults
	}
}

export const detailListStore = new DetailListStore()
