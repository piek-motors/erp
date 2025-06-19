import { $api } from 'lib/api'

type FileRelatedTo = 'order' | 'detail'

export class FileService {
  static s3_url = '/s3/'

  static async uploadFiles(
    acceptedFiles: File[],
    relationId: number,
    relatedTo: FileRelatedTo
  ) {
    const formData = new FormData()
    acceptedFiles.map(file => formData.append('files', file))

    const res = await $api.put(this.s3_url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        order_id: relatedTo === 'order' ? relationId : undefined,
        detail_id: relatedTo === 'detail' ? relationId : undefined
      }
    })
    return res
  }
}
