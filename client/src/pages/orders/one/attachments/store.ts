import { apolloClient } from 'api'
import { OrderAttachment } from 'domain-model'
import { makeAutoObservable } from 'mobx'
import { map } from 'pages/orders/mappers'
import { FileService } from 'services/file.service'
import * as gql from 'types/graphql-shema'

interface UploadFileResp {
  filename: string
  id: number
  key: string
  order_id: number
  size: number
  uploaded_at: string
}

export class AttachmentsStore {
  files: OrderAttachment[] = []
  uploading: boolean = false
  editState: boolean = false
  uploadingFiles: File[] = []
  constructor() {
    makeAutoObservable(this)
  }
  setUploadingFiles(files: File[]) {
    this.uploadingFiles = files
  }
  setFiles(files: OrderAttachment[]) {
    this.files = files
  }
  async load(orderId: number) {
    const res = await apolloClient.query<
      gql.GetOrderAttachmentsQuery,
      gql.GetOrderAttachmentsQueryVariables
    >({
      query: gql.GetOrderAttachmentsDocument,
      variables: {
        order_id: orderId
      }
    })
    this.setFiles(res.data.orders_attachments.map(map.order.docsFromDto))
  }
  async onDrop(files: File[], orderId: number) {
    this.setUploadingFiles(files)
    const res = await FileService.uploadFiles(files, orderId)
    if (res.status === 200) {
    } else {
      console.log('S3 file upload error', res)
    }
    this.setUploadingFiles([])
    const data = res.data as UploadFileResp[]
    const newAttachments = data.map(file => {
      return new OrderAttachment({
        id: file.id,
        key: file.key,
        name: file.filename,
        size: file.size
      })
    })
    this.setFiles([...this.files, ...newAttachments])
  }

  async delete(file: OrderAttachment) {
    await FileService.deleteFile(file.key)
    this.setFiles(this.files.filter(f => f.key !== file.key))
  }
}

export const attachmentsStore = new AttachmentsStore()