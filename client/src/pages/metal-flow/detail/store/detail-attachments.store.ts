import { Attachment } from 'domain-model'
import { FileService } from 'lib/services/file.service'
import { rpc } from 'lib/trpc.client'
import { makeAutoObservable } from 'mobx'
import { loadDetailAttachments } from './detail.api'

interface UploadFileResp {
  filename: string
  id: number
  key: string
  detail_id: number
  size: number
  uploaded_at: string
}

export class DetailAttachmentsStore {
  files: Attachment[] = []
  uploading: boolean = false
  editState: boolean = false
  uploadingFiles: File[] = []

  constructor() {
    makeAutoObservable(this)
  }

  setUploadingFiles(files: File[]) {
    this.uploadingFiles = files
  }

  setFiles(files: Attachment[]) {
    this.files = files
  }

  async loadAttachments(detailId: number) {
    const attachments = await loadDetailAttachments(detailId)
    this.setFiles(attachments)
  }

  async onDrop(files: File[], detailId: number) {
    this.setUploadingFiles(files)
    const res = await FileService.uploadFiles(files, detailId, 'detail')
    if (res.status === 200) {
    } else {
      console.log('S3 file upload error', res)
    }
    this.setUploadingFiles([])
    const data = res.data as UploadFileResp[]
    const newAttachments = data.map(file => {
      return new Attachment(file.id, file.filename, file.size, file.key)
    })
    this.setFiles([...this.files, ...newAttachments])
  }

  async delete(file: Attachment) {
    await rpc.deleteFile.mutate({ type: 'detail', key: file.key })
    this.setFiles(this.files.filter(f => f.key !== file.key))
  }
}

export const detailAttachmentsStore = new DetailAttachmentsStore()
