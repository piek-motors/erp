import { rpc } from 'lib/rpc/rpc.client'
import { makeAutoObservable } from 'mobx'
import type { RouterOutput } from 'srv/lib/trpc'

export type DetailGroup = RouterOutput['pdo']['detail_groups']['list'][number]

export class DetailGroupCache {
	private groups: DetailGroup[] = []
	setGroups(groups: DetailGroup[]) {
		this.groups = groups
	}
	getGroups() {
		return this.groups.slice().sort((a, b) =>
			a.name.localeCompare(b.name, 'ru', {
				numeric: true,
				sensitivity: 'base',
			}),
		)
	}
	getGroupName(id?: number | null) {
		if (!id) return null
		return this.groups.find(g => g.id === id)?.name
	}
	removeGroup(id: number) {
		this.setGroups(this.groups.filter(g => g.id !== id))
	}
	addGroup(group: DetailGroup) {
		this.setGroups([...this.groups, group])
	}
	updateGroup(group: DetailGroup) {
		this.setGroups(this.groups.map(g => (g.id === group.id ? group : g)))
	}
	constructor() {
		makeAutoObservable(this)
	}
	async load() {
		const groups = await rpc.pdo.detail_groups.list.query()
		this.setGroups(groups)
		return groups
	}
}
