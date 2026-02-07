import { rpc } from '@/lib/rpc/rpc.client'
import { makeAutoObservable } from 'mobx'
import type { Color } from 'models'
import type { Detail } from './group.store'

export class ColorSegmentation {
  anchorEl: HTMLElement | null = null
  constructor() {
    makeAutoObservable(this)
  }

  groupId: number | null = null
  detail: Detail | null = null
  addOrDeleteColor(color: Color) {
    if (!this.detail) {
      throw new Error('Detail is not initialized')
    }
    const colors = Array.isArray(this.detail.colors) ? this.detail.colors : []
    if (colors.includes(color)) {
      this.detail.setColors(colors.filter(c => c !== color))
    } else {
      this.detail.setColors([...colors, color])
    }
  }

  init(anchorEl: HTMLElement, detail: Detail, groupId: number) {
    this.anchorEl = anchorEl
    this.detail = detail
    this.groupId = groupId
  }

  clear() {
    this.anchorEl = null
    this.detail = null
  }

  async save() {
    if (!this.detail) {
      throw new Error('Detail ID and group ID are required')
    }
    await rpc.pdo.detail_groups.set_color_annotation.mutate({
      detail_id: this.detail.id,
      group_id: this.groupId!,
      colors: this.detail.colors?.map(c => +c) || [],
    })
  }
}
