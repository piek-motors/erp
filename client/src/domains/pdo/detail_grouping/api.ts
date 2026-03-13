import { makeAutoObservable } from 'mobx'
import { app_cache } from '@/domains/pdo/cache'
import { matrixDecoder } from '@/lib/rpc/matrix_decoder'
import { rpc } from '@/lib/rpc/rpc.client'
import { LoadingController } from '@/lib/store/loading_controller'
import type { DetailInTheGroup } from '@/server/domains/pdo/storage/detail_group_repo'
import { Detail, DetailGroupStore } from './group.store'

export class DetailGroupingApi {
  readonly groups_tree_loading = new LoadingController()
  readonly details_loading = new LoadingController()

  constructor() {
    makeAutoObservable(this)
  }

  async list_groups() {
    return this.groups_tree_loading.run(async () => {
      await app_cache.groups.invalidate()
    })
  }

  async load_group_with_details(groupId: number) {
    return this.details_loading.run(async () => {
      const resp = await rpc.pdo.detail_groups.get.query({ groupId })
      const details = matrixDecoder<DetailInTheGroup>(resp.details)
      store.open_group({
        group: resp.group,
        details: details.map(
          d => new Detail(d.id, d.name, d.drawing_number, d.group_ids),
        ),
      })
    })
  }

  async create_group(name: string, parent_id?: number | null) {
    return this.groups_tree_loading.run(async () => {
      const newGroup = await rpc.pdo.detail_groups.create.mutate({
        name,
        parent_id,
      })
      await app_cache.groups.invalidate()
      return newGroup
    })
  }

  async update_group(id: number, name: string, parent_id?: number | null) {
    return this.groups_tree_loading.run(async () => {
      const updatedGroup = await rpc.pdo.detail_groups.update.mutate({
        id,
        name,
        parent_id,
      })
      await app_cache.groups.invalidate()
      if (store.opened_group?.group.id === id) {
        await this.load_group_with_details(id)
      }
      return updatedGroup
    })
  }
}

export const store = new DetailGroupStore()
export const detail_groups_vm = store
export const api = new DetailGroupingApi()
