import { makeAutoObservable } from 'mobx'
import { app_cache } from '@/domains/pdo/cache'
import { matrixDecoder } from '@/lib/rpc/matrix_decoder'
import { rpc } from '@/lib/rpc/rpc.client'
import { LoadingController } from '@/lib/store/loading_controller'
import type { DetailInTheGroup } from '@/server/domains/pdo/storage/detail_group_repo'
import { DetailSt } from '../detail/detail.state'
import { store } from './group.store'

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
      store.open_group(
        resp.group,
        details.map(d => {
          const detail = new DetailSt()
          detail.id = d.id
          detail.name = d.name
          detail.drawing_number = d.drawing_number ?? ''
          detail.group_assigment.set_group_ids(d.group_ids)
          return detail
        }),
      )
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
      return updatedGroup
    })
  }
}

export const api = new DetailGroupingApi()
