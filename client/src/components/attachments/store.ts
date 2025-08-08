import { makeAutoObservable, rpc } from 'lib/deps'
import { FileService } from 'lib/services/file.service'
import { Attachment } from 'models'

interface UploadFileResp {
  filename: string
  id: number
  key: string
  order_id: number
  size: number
  uploaded_at: string
}

export class AttachmentsStore {
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

  async onDrop(
    files: File[],
    relationId: number,
    relatedTo: 'order' | 'detail'
  ) {
    this.setUploadingFiles(files)
    const res = await FileService.uploadFiles(files, relationId, relatedTo)
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

  async delete(file: Attachment, relatedTo: 'order' | 'detail') {
    await rpc.attachments.deleteFile.mutate({ type: relatedTo, key: file.key })
    this.setFiles(this.files.filter(f => f.key !== file.key))
  }

  async rename(file: Attachment, newName: string) {
    await rpc.attachments.updateName.mutate({ key: file.key, name: newName })
    this.setFiles(
      this.files.map(f =>
        f.key === file.key ? new Attachment(f.id, newName, f.size, f.key) : f
      )
    )
  }
}
