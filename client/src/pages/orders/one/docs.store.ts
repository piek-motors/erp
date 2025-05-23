/** @jsxImportSource @emotion/react */
import { apolloClient } from 'api'
import { OrderAttachment } from 'domain-model'
import { makeAutoObservable } from 'mobx'
import { map } from 'pages/orders/mappers'
import { FileService } from 'services/file.service'
import {
  GetOrderAttachmentsDocument,
  GetOrderAttachmentsQuery,
  GetOrderAttachmentsQueryVariables
} from 'types/graphql-shema'

class DocsState {
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

  async handleFilesOnDrop(files: File[], orderId: number) {
    console.log('handleFilesOnDrop', files, orderId)
    this.setUploadingFiles(files)
    const res = await FileService.uploadFiles(files, orderId)
    if (res.status === 200) {
    } else {
      console.log('S3 file upload error', res)
    }
    this.setUploadingFiles([])
  }

  async deleteFile(file: OrderAttachment) {
    await FileService.deleteFile(file.key!)
  }

  async fetchAttachments(orderId: number) {
    const res = await apolloClient.query<
      GetOrderAttachmentsQuery,
      GetOrderAttachmentsQueryVariables
    >({
      query: GetOrderAttachmentsDocument,
      variables: {
        OrderID: orderId
      }
    })

    this.files = res.data.erp_Docs.map(map.order.docsFromDto)
  }
}

export const docsStore = new DocsState()
