import { app_cache } from 'domains/pdo/cache'
import { matrixDecoder } from 'lib/rpc/matrix_decoder'
import { rpc } from 'lib/rpc/rpc.client'
import { LoadingController } from 'lib/store/loading_controller'
import { makeAutoObservable } from 'mobx'
import type { DetailInTheGroup } from 'srv/rpc/pdo/detail_groups'
import { Detail, DetailGroupStore } from './group.store'

export class DetailGroupingApi {
	readonly groupsLoading = new LoadingController()
	readonly store = new DetailGroupStore()
	readonly targetGroupLoading = new LoadingController()

	constructor() {
		makeAutoObservable(this)
	}

	async listGroups() {
		return this.groupsLoading.run(async () => {
			await app_cache.detailGroups.load()
		})
	}

	async loadGroupWithDetails(groupId: number) {
		return this.targetGroupLoading.run(async () => {
			const resp = await rpc.pdo.detail_groups.get.query({ groupId })
			const details = matrixDecoder<DetailInTheGroup>(resp.details)
			this.store.openGroup({
				group: resp.group,
				details: details.map(d => {
					const detail = new Detail()
					detail.id = d.id
					detail.name = d.name
					detail.part_code = d.part_code
					detail.group_id = d.group_id
					detail.colors = d.colors
					return detail
				}),
			})
		})
	}

	async createGroup(name: string) {
		return this.groupsLoading.run(async () => {
			const newGroup = await rpc.pdo.detail_groups.create.mutate({ name })
			await app_cache.detailGroups.load()
			return newGroup
		})
	}

	async updateGroup(id: number, name: string) {
		return this.groupsLoading.run(async () => {
			const updatedGroup = await rpc.pdo.detail_groups.update.mutate({
				id,
				name,
			})
			await app_cache.detailGroups.load()
			if (this.store.openedGroup?.group.id === id) {
				await this.loadGroupWithDetails(id)
			}
			return updatedGroup
		})
	}

	async addDetailsToGroup(groupId: number, detailIds: number[]) {
		return this.groupsLoading.run(async () => {
			await rpc.pdo.detail_groups.add_details.mutate({
				group_id: groupId,
				detail_ids: detailIds,
			})
			await this.loadGroupWithDetails(groupId)
			this.store.clearSelection()
		})
	}

	async removeDetailsFromGroup(group_id: number, detail_ids: number[]) {
		return this.groupsLoading.run(async () => {
			await rpc.pdo.detail_groups.remove_details.mutate({
				group_id,
				detail_ids,
			})
			await this.loadGroupWithDetails(group_id)
			this.store.clearSelection()
		})
	}
}

export const api = new DetailGroupingApi()
