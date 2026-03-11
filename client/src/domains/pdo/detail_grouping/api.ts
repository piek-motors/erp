import { makeAutoObservable } from 'mobx'
import { app_cache } from '@/domains/pdo/cache'
import { matrixDecoder } from '@/lib/rpc/matrix_decoder'
import { rpc } from '@/lib/rpc/rpc.client'
import { LoadingController } from '@/lib/store/loading_controller'
import type { DetailInTheGroup } from '@/server/domains/pdo/detail_groups_rpc'
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
      await app_cache.groups.invalidate()
    })
  }

  async loadGroupWithDetails(groupId: number) {
    return this.targetGroupLoading.run(async () => {
      const resp = await rpc.pdo.detail_groups.get.query({ groupId })
      const details = matrixDecoder<DetailInTheGroup>(resp.details)
      this.store.openGroup({
        group: resp.group,
        details: details.map(
          d => new Detail(d.id, d.name, d.drawing_number, d.group_ids),
        ),
      })
    })
  }

  async createGroup(name: string) {
    return this.groupsLoading.run(async () => {
      const newGroup = await rpc.pdo.detail_groups.create.mutate({ name })
      await app_cache.groups.invalidate()
      return newGroup
    })
  }

  async updateGroup(id: number, name: string) {
    return this.groupsLoading.run(async () => {
      const updatedGroup = await rpc.pdo.detail_groups.update.mutate({
        id,
        name,
      })
      await app_cache.groups.invalidate()
      if (this.store.openedGroup?.group.id === id) {
        await this.loadGroupWithDetails(id)
      }
      return updatedGroup
    })
  }
}

export const api = new DetailGroupingApi()
