import { app_cache } from 'domains/pdo/cache'
import { makeAutoObservable } from 'mobx'
import type { Color } from 'models'
import { ColorSegmentation } from './color_segmentation.store'

class GroupNameState {
	constructor() {
		makeAutoObservable(this)
	}
	name: string = ''
	setName(name: string) {
		this.name = name
	}
	modalOpen: boolean = false
	setModalOpen(open: boolean) {
		this.modalOpen = open
	}
}

export interface Group {
	id: number
	name: string
}

export class Detail {
	id!: number
	name!: string
	part_code!: string | null
	group_id!: number | null
	colors?: Color[]
	setColors(colors: Color[]) {
		this.colors = colors
	}
	constructor() {
		makeAutoObservable(this)
	}
}

export interface GroupWithDetails {
	group: Group
	details: Detail[]
}

export class DetailListStore {
	query?: string

	constructor() {
		makeAutoObservable(this)
	}

	setQuery(q?: string) {
		this.query = q
	}

	getFilteredAndSorted(details: Detail[]): Detail[] {
		return this.sortDetails(this.filterDetailsByQuery(details))
	}

	private getQueryTokens(): string[] {
		return this.query?.toLowerCase().split(/\s+/).filter(Boolean) ?? []
	}

	private filterDetailsByQuery(details: Detail[]): Detail[] {
		const tokens = this.getQueryTokens()

		if (tokens.length === 0) {
			return details
		}

		return details.filter(detail => this.matchesAllTokens(detail.name, tokens))
	}

	private matchesAllTokens(text: string, tokens: string[]): boolean {
		const value = text.toLowerCase()
		return tokens.every(token => value.includes(token))
	}

	private sortDetails(details: Detail[]): Detail[] {
		return details.slice().sort((a, b) =>
			a.name.localeCompare(b.name, 'ru', {
				numeric: true,
				sensitivity: 'base',
			}),
		)
	}
}

export class DetailGroupStore {
	readonly groupNameState = new GroupNameState()
	readonly colorSegmentation = new ColorSegmentation()
	readonly detailList = new DetailListStore()

	openedGroup: GroupWithDetails | null = null
	selectedDetailIds: number[] = []

	constructor() {
		makeAutoObservable(this)
	}

	get groups() {
		return app_cache.detailGroups.getGroups()
	}

	get targetGroupDetails() {
		const details = this.openedGroup?.details ?? []
		return this.detailList.getFilteredAndSorted(details)
	}

	openGroup(group: GroupWithDetails | null) {
		this.openedGroup = group
		this.openedGroup?.details.sort((a, b) => a.name.localeCompare(b.name))
		this.groupNameState.setName(group?.group.name || '')
		this.colorSegmentation.clear()
	}

	setSelectedDetailIds(ids: number[]) {
		this.selectedDetailIds = ids
	}

	toggleDetailSelection(detailId: number) {
		this.selectedDetailIds = this.selectedDetailIds.includes(detailId)
			? this.selectedDetailIds.filter(id => id !== detailId)
			: [...this.selectedDetailIds, detailId]
	}

	clearSelection() {
		this.selectedDetailIds = []
	}

	clear() {
		this.openedGroup = null
		this.selectedDetailIds = []
	}
}
