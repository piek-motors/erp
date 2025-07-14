import { AsyncStoreController } from 'lib/async-store.controller'
import { makeAutoObservable, rpc } from 'lib/deps'

interface IDetail {
  id: number
  name: string
  group_id: number | null
}

export class DetailListStore {
  readonly async = new AsyncStoreController()
  constructor() {
    makeAutoObservable(this)
  }

  detailsModalOpen = false
  setDetailsModalOpen(open: boolean, material_id: number) {
    this.detailsModalOpen = open

    if (open) {
      this.loadDetails(material_id)
    } else {
      this.reset()
    }
  }
  detailsMadeFromThisMaterial: IDetail[] = []
  setDetailsMadeFromThisMaterial(details: IDetail[]) {
    this.detailsMadeFromThisMaterial = details
  }
  reset() {
    this.detailsMadeFromThisMaterial = []
    this.detailsModalOpen = false
  }

  async loadDetails(material_id: number) {
    this.async.start()
    const res = await rpc.metal.details.listByMaterialId.query({
      material_id
    })
    this.setDetailsMadeFromThisMaterial(
      res.map(e => ({
        id: e.detail_id,
        name: e.name,
        group_id: e.logical_group_id
      }))
    )
    this.async.end()
  }
}

export const detailList = new DetailListStore()
