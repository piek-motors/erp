import { $api } from 'lib/axios'

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

    if (!relationId) {
      throw new Error('Relation ID is required')
    }

    const res = await $api.put(this.s3_url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        orderid: relatedTo === 'order' ? relationId.toString() : undefined,
        detailid: relatedTo === 'detail' ? relationId.toString() : undefined
      }
    })
    return res
  }
}
