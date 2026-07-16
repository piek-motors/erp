import { makeAutoObservable } from 'mobx'
import { notifier } from '@/lib/store/notifier.store'
import {
  type DetailClaimRequestFull,
  type DetailClaimRequestListItem,
  detail_request_api,
} from './api'

export class DetailRequestListStore {
  requests: DetailClaimRequestListItem[] = []
  selectedId: number | null = null
  selectedRequest: DetailClaimRequestFull | null = null
  editOpen = false

  constructor() {
    makeAutoObservable(this)
  }

  async reload() {
    this.requests = await detail_request_api.list()
  }

  setSelectedId(id: number | null) {
    this.selectedId = id
    if (id == null) {
      this.selectedRequest = null
    }
  }

  closeDetails() {
    this.setSelectedId(null)
  }

  setEditOpen(open: boolean) {
    this.editOpen = open
  }

  async loadSelected() {
    if (!this.selectedId) return
    this.selectedRequest = await detail_request_api.get(this.selectedId)
  }

  async fulfillSelected() {
    if (!this.selectedRequest) return

    await detail_request_api.fulfill(this.selectedRequest.request.id)
    notifier.ok('Требование выполнено')
    await this.loadSelected()
    await this.reload()
  }

  async deleteSelected() {
    if (!this.selectedRequest) return

    await detail_request_api.delete(this.selectedRequest.request.id)
    notifier.ok('Требование удалено')
    this.closeDetails()
    await this.reload()
  }

  async afterEditSaved() {
    await this.loadSelected()
    await this.reload()
  }
}
