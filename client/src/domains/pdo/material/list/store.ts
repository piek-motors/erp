import { app_cache } from 'domains/pdo/cache'
import { LoadingController } from 'lib/store/loading_controller'
import { debounce } from 'lib/utils/debounce'
import { SearchConfig, tokenSearch } from 'lib/utils/search'
import { makeAutoObservable, reaction } from 'mobx'
import type { MaterialShape } from 'models'
import type { Material } from 'srv/rpc/pdo/materials'

export enum MaterialFilterCriteria {
	Id = '№',
	Label = 'Наим.',
}

export class MaterialListStore {
	readonly async = new LoadingController()

	search_query: string = ''
	shape_filter?: MaterialShape | null
	filter_criteria = MaterialFilterCriteria.Label

	search_result: Material[] = []

	debouncedFilter: () => void
	constructor() {
		makeAutoObservable(this)
		this.debouncedFilter = debounce(this.filter.bind(this), 300)

		reaction(
			() => app_cache.materials.normalized_materials,
			() => this.filter(),
		)
	}

	private filter() {
		const query = this.search_query
		let items = app_cache.materials.normalized_materials

		if (this.shape_filter != null) {
			items = items.filter(m => m.shape === this.shape_filter)
		}

		if (query) {
			items = tokenSearch(
				items,
				query,
				material_search_config(this.filter_criteria),
			)
		}

		this.search_result = items
	}

	set_search_query(keyword: string) {
		this.search_query = keyword
		this.debouncedFilter()
	}

	set_shape_filter(shape?: MaterialShape) {
		this.shape_filter = shape
		this.filter()
	}

	set_filter_criteria(c: MaterialFilterCriteria) {
		this.filter_criteria = c
		this.filter()
	}

	clear() {
		this.search_query = ''
		this.async.reset()
	}
}

export const materialListStore = new MaterialListStore()

export function material_search_config(
	criteria: MaterialFilterCriteria,
): SearchConfig<Material> {
	switch (criteria) {
		case MaterialFilterCriteria.Id:
			return {
				fields: [
					{
						get: (m: Material) => m.id.toString(),
						exact: true,
					},
				],
			}

		case MaterialFilterCriteria.Label:
			return {
				fields: [
					{
						get: (m: Material) => m.label,
						weight: 2,
					},
					{
						get: (m: Material) => m.id.toString(),
						weight: 1,
						exact: true,
					},
				],
			}
	}
}
