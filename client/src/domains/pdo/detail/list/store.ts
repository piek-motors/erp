import {
	PaginatedSearchStore,
	type SearchFilters,
} from 'components/search-paginated'
import { app_cache } from 'domains/pdo/cache'
import { LoadingController } from 'lib/store/loading_controller'
import { makeAutoObservable, reaction, runInAction } from 'mobx'
import type { DetailSt } from '../detail.state'

export class DetailList {
	readonly loader = new LoadingController()
	readonly searchStore: PaginatedSearchStore<DetailSt>

	constructor() {
		this.searchStore = new PaginatedSearchStore<DetailSt>(
			() => app_cache.details.details,
			{
				pageSize: 50,
				customFilter: this.filter_details.bind(this),
			},
		)
		makeAutoObservable(this)

		// Auto-reindex when cache.details.details changes
		reaction(
			() => app_cache.details.details,
			details => {
				details && this.index()
			},
		)
	}

	drawing_num: string = ''
	index_letter: string | null = null

	index() {
		this.searchStore.search()
	}

	set_keyword(keyword: string) {
		this.clear_search_args()
		this.searchStore.setSearchKeyword(keyword)
	}

	set_id(id: string) {
		this.clear_search_args()
		this.searchStore.setSearchId(id)
	}

	set_drawing_num(partCode: string) {
		this.clear_search_args()
		this.drawing_num = partCode
	}

	set_index_letter(letter: string) {
		if (this.index_letter === letter) {
			this.index_letter = null
			this.searchStore.search()
			return
		}
		this.clear_search_args()
		this.index_letter = letter
	}

	// Custom filter function for the search store
	private filter_details(
		details: DetailSt[],
		filters: SearchFilters,
	): DetailSt[] {
		this.searchStore.setIsSearching(true)
		// Handle built-in filters first (keyword, id)
		if (filters.keyword) {
			const tokens = filters.keyword.toLowerCase().split(/\s+/).filter(Boolean)
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
				.filter(Boolean)
				.sort((a, b) => b!.score - a!.score)
				.map(item => item!.detail)
		}

		if (filters.id) {
			return details.filter(detail => detail.id?.toString() === filters.id)
		}

		// Handle custom filters (partCode, indexLetter)
		if (this.drawing_num) {
			const partCode = this.drawing_num.toLowerCase()
			return details.filter(
				detail =>
					detail.drawingNumber &&
					detail.drawingNumber.toLowerCase().startsWith(partCode),
			)
		}

		if (this.index_letter) {
			return details.filter(
				detail => detail.name.charAt(0).toUpperCase() === this.index_letter,
			)
		}

		return details
	}

	private clear_search_args() {
		runInAction(() => {
			this.drawing_num = ''
			this.searchStore.clear()
			this.index_letter = null
		})
	}

	get displayed_results() {
		return this.searchStore.displayedResults
	}
	get search_keyword() {
		return this.searchStore.searchFilters.keyword
	}
	get search_id() {
		return this.searchStore.searchFilters.id
	}
}

export const detailListStore = new DetailList()
